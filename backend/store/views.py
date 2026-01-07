from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.conf import settings
import stripe
from .models import Category, Product, Review, Cart, CartItem, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, ReviewSerializer,
    CartSerializer, CartItemSerializer, OrderSerializer, UserSerializer,
    AdminOrderSerializer
)


class IsCartOwnerOrReadOnly(BasePermission):
    """
    Custom permission to only allow owners of a cart to modify it
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the cart.
        return obj.user == request.user


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        
        if category:
            queryset = queryset.filter(category__slug=category)
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        product = self.get_object()
        reviews = product.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        # Update product rating
        product = serializer.validated_data['product']
        reviews = Review.objects.filter(product=product)
        if reviews.exists():
            avg_rating = sum(r.rating for r in reviews) / reviews.count()
            product.rating = round(avg_rating, 2)
            product.num_reviews = reviews.count()
            product.save()


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Cart.objects.filter(user=self.request.user)
        else:
            session_key = self.request.session.session_key
            if not session_key:
                return Cart.objects.none()
            return Cart.objects.filter(session_key=session_key, user__isnull=True)

    def get_or_create_cart(self):
        if self.request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=self.request.user)
            
            session_key = self.request.session.session_key
            if session_key:
                anonymous_cart = Cart.objects.filter(
                    session_key=session_key,
                    user__isnull=True
                ).exclude(items__isnull=True).first()
                
                if anonymous_cart and anonymous_cart != cart:
                    self.merge_carts(cart, anonymous_cart)
                    anonymous_cart.delete()
        else:
            if not self.request.session.session_key:
                self.request.session.create()
            
            session_key = self.request.session.session_key
            cart, created = Cart.objects.get_or_create(
                session_key=session_key,
                user=None  
            )
        
        return cart
    
    def get_session_key(self, create=True):
        """Get or create session key if it doesn't exist"""
        if not self.request.session.session_key:
            if create:
                self.request.session.create()
            else:
                return None
        return self.request.session.session_key
    
    def merge_carts(self, target_cart, source_cart):
        """Merge items from source cart into target cart"""
        for item in source_cart.items.all():
            # Check if the same product already exists in the target cart
            existing_item = target_cart.items.filter(product=item.product).first()
            if existing_item:
                # If it exists, update the quantity
                existing_item.quantity += item.quantity
                existing_item.save()
            else:
                # If not, move the item to the target cart
                item.cart = target_cart
                item.save()
        target_cart.save()  # This will update the updated_at field

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        cart = self.get_or_create_cart()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart = self.get_or_create_cart()
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        product = get_object_or_404(Product, id=product_id, is_active=True)
        
        if product.stock < quantity:
            return Response(
                {'error': 'Insufficient stock'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            if cart_item.quantity > product.stock:
                return Response(
                    {'error': 'Insufficient stock'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.save()
        
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def update_item(self, request):
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))
        
        cart = self.get_or_create_cart()
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        
        if quantity <= 0:
            cart_item.delete()
            return Response({'message': 'Item removed from cart'})
        
        if cart_item.product.stock < quantity:
            return Response(
                {'error': 'Insufficient stock'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_item.quantity = quantity
        cart_item.save()
        
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def create_payment_intent(self, request):
        cart = self.get_or_create_cart()
        
        if not cart.items.exists():
             return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate total amount (in cents for Stripe)
        total_amount = int(cart.total_price * 100) 
        
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            intent = stripe.PaymentIntent.create(
                amount=total_amount,
                currency='usd',
                metadata={'cart_id': cart.id}
            )
            return Response({'clientSecret': intent.client_secret})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        item_id = request.data.get('item_id')
        cart = self.get_or_create_cart()
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        return Response({'message': 'Item removed from cart'})


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return cart items that belong to the current user's cart
        cart = get_object_or_404(Cart, user=self.request.user)
        return CartItem.objects.filter(cart=cart)

    def perform_create(self, serializer):
        # Ensure the cart item is added to the current user's cart
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        serializer.save(cart=cart)

    def perform_update(self, serializer):
        # Ensure the cart item belongs to the current user's cart
        cart = get_object_or_404(Cart, user=self.request.user)
        if serializer.instance.cart != cart:
            raise PermissionDenied("You can only modify items in your own cart.")
        serializer.save()

    def perform_destroy(self, instance):
        # Ensure the cart item belongs to the current user's cart
        if instance.cart.user != self.request.user:
            raise PermissionDenied("You can only delete items from your own cart.")
        instance.delete()


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Allow admins (staff) to see all orders
        if self.request.user.is_staff:
            return Order.objects.all()
            
        if self.request.user.is_authenticated:
            return Order.objects.filter(user=self.request.user)
        else:
            session_key = self.request.session.session_key
            if session_key:
                return Order.objects.filter(session_key=session_key)
            return Order.objects.none()

    def get_serializer_class(self):
        if self.request.user.is_staff and self.request.method in ['PUT', 'PATCH']:
            return AdminOrderSerializer
        return OrderSerializer

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def set_status(self, request, pk=None):
        order = self.get_object()
        status_value = request.data.get('status')
        if not status_value:
            return Response({'error': 'Status required'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = status_value
        order.save()
        return Response({'status': order.status})

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        cart = Cart.objects.filter(
            user=request.user if request.user.is_authenticated else None,
            session_key=request.session.session_key if not request.user.is_authenticated else None
        ).first()
        
        if not cart or not cart.items.exists():
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate stock
        for item in cart.items.all():
            if item.product.stock < item.quantity:
                return Response(
                    {'error': f'Insufficient stock for {item.product.name}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Create order
        order_data = request.data.copy()
        order_data['user'] = request.user.id if request.user.is_authenticated else None
        order_data['session_key'] = request.session.session_key if not request.user.is_authenticated else None
        order_data['total_price'] = cart.total_price
        
        serializer = self.get_serializer(data=order_data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        # Handle status update if provided (allows setting 'delivered' immediately)
        if 'status' in request.data:
            order.status = request.data['status']
            order.save()
        
        # Create order items and update stock
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
            item.product.stock -= item.quantity
            item.product.save()
        
        # Clear cart
        cart.items.all().delete()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

