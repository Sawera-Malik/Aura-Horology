from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ProductViewSet, ReviewViewSet,
    CartViewSet, OrderViewSet, CartItemViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'cart/items', CartItemViewSet, basename='cart-item')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    # Add a separate endpoint to get the current user's cart
    path('cart/my-cart/', CartViewSet.as_view({'get': 'my_cart'}), name='my-cart'),
    path('cart/add-item/', CartViewSet.as_view({'post': 'add_item'}), name='add-item'),
    path('cart/remove-item/', CartViewSet.as_view({'post': 'remove_item'}), name='remove-item'),
]

