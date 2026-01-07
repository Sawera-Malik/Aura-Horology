from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Product, Review, Cart, CartItem, Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    discount_percentage = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'compare_at_price',
            'category', 'category_id', 'image', 'stock', 'is_active',
            'rating', 'num_reviews', 'discount_percentage', 'created_at'
        ]


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price', 'total_items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate(self, data):
        # Ensure users can only modify their own cart
        if self.instance and self.instance.user and self.instance.user != self.context['request'].user:
            raise serializers.ValidationError("You can only modify your own cart.")
        return data


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'subtotal']



class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'status', 'total_price', 'first_name', 'last_name',
            'email', 'phone', 'address', 'city', 'state', 'zip_code', 'country',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'status', 'created_at', 'updated_at']


class AdminOrderSerializer(OrderSerializer):
    class Meta(OrderSerializer.Meta):
        # Allow admins to update status
        read_only_fields = ['user', 'created_at', 'updated_at']



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

