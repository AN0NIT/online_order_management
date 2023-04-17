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


class CategoryStockHistoryAdmin(admin.ModelAdmin):
    ordering = ['date']


admin.site.register(CategoryStockHistory, CategoryStockHistoryAdmin)
