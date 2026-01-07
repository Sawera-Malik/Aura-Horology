from django.contrib import admin
from .models import Category, Product, Review, Cart, CartItem, Order, OrderItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'is_active', 'rating', 'created_at']
    list_filter = ['category', 'is_active', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']
    list_editable = ['price', 'stock', 'is_active']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['product__name', 'user__username', 'comment']


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_key', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    inlines = [CartItemInline]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_price', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['id', 'email', 'first_name', 'last_name']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [OrderItemInline]
    fieldsets = (
        ('Order Information', {
            'fields': ('user', 'session_key', 'status', 'total_price')
        }),
        ('Shipping Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'zip_code', 'country')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

