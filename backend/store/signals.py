from django.contrib.auth import user_logged_in
from django.dispatch import receiver
from .models import Cart

@receiver(user_logged_in)
def merge_carts_on_login(sender, request, user, **kwargs):
    """
    Signal handler to merge anonymous cart with user's cart on login.
    """
    # Get the anonymous cart if it exists
    session_key = request.session.session_key
    if session_key:
        anonymous_cart = Cart.objects.filter(session_key=session_key).first()
        if anonymous_cart:
            # Get or create user's cart
            user_cart, created = Cart.objects.get_or_create(user=user)
            
            # If the anonymous cart is different from the user's cart, merge them
            if anonymous_cart != user_cart:
                # Move all items from anonymous cart to user's cart
                for item in anonymous_cart.items.all():
                    existing_item = user_cart.items.filter(product=item.product).first()
                    if existing_item:
                        existing_item.quantity += item.quantity
                        existing_item.save()
                    else:
                        item.cart = user_cart
                        item.save()
                
                # Delete the anonymous cart
                anonymous_cart.delete()
                
                # Update the session to use the user's cart
                request.session['cart_id'] = str(user_cart.id)
