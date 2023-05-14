from django.contrib import admin
from .models import *

# Register your models here.


class UserAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)
    fields = ('id', 'username', 'fullname', 'dob',
              'email', 'password', 'role', 'added_date','gstin')


admin.site.register(User, UserAdmin)


class ProductAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)
    fields = ('id', 'userid', 'name', 'category', 'price', 'status', 'image',
              'quantity', 'added_date', 'edited_date')


admin.site.register(Product, ProductAdmin)


class CartAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)
    #fields = ('id','buyer_id','seller_id','category','quantity','product_id','price')
    #fields = ('id','buyer_id','category','quantity','product_id','price')
    #fields = ('id','buyer_id','seller_id','product_name','product_id')
    fields = ('id','buyer_id','seller_id','quantity','product_id','ispurchased','issold')
    # fields = ('id', 'buyer_id', 'quantity','product_id','product','name','ispurchased')

admin.site.register(AddToCart, CartAdmin)



class CategoryStockHistoryAdmin(admin.ModelAdmin):
    ordering = ['date']


admin.site.register(CategoryStockHistory, CategoryStockHistoryAdmin)
