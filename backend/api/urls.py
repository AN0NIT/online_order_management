from django.urls import path
from django.conf import settings
from . import views
from django.conf.urls.static import static


urlpatterns = [

    path('upload/', views.image_upload_view),

    # User apis
    path('api/login/', views.login, name='login'),
    path('api/signup/', views.signup, name='signup'),

    path('api/user/product/all/',
         views.get_all_products_from_a_user, name='get_all_products_from_a_user'),

    # Product apis
    path('api/product/<uuid:pid>', views.get_product, name='get_product'),
    path('api/product/add/', views.add_product, name='add_product'),
    path('api/product/edit/<uuid:pid>', views.edit_product, name='edit_product'),
    path('api/product/delete/', views.delete_product, name='delete_product'),
    path('api/product/category/all/', views.get_available_categories,
         name='get_available_categories'),
    path('api/product/allproducts/', views.get_all_products, name='all_product'),

    # Cart apis
    path('api/addtocart/<uuid:order_id>', views.get_cart, name='get_cart'),
    path('api/addtocart/add/', views.add_cart_item, name='add_to_cart'),
    path('api/addtocart/edit/<uuid:order_id>', views.edit_cart_item, name='edit_cart'),
    path('api/addtocart/delete/<uuid:order_id>', views.delete_cart_item, name='delete_from_cart'),
    path('api/addtocart/all/', views.get_cart_from_a_buyer,
         name='get_cart_from_a_buyer'),
    path('api/addtocart/orders/', views.get_cart_from_a_seller,
         name='get_cart_from_a_seller'),
    
    # ml
    path('api/product/category/stock/recommendation', views.get_stock_recommendation,
         name='get_stock_recommendation'),
    path('api/product/category/stock/recommendation/allyear', views.get_stock_recommendation_for_entire_year,
         name='get_stock_recommendation_for_entire_year'),
    path('api/product/price/recommendation', views.get_dynamic_price_for_product,
         name='get_dynamic_price_for_product'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
