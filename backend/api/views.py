import pandas as pd

from enum import Enum
import json

from ml.models import SeasonalDemandClassifier, DynamicPricing

from . models import *
from .serializers import *
from django.http import HttpResponseRedirect, HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from rest_framework import serializers, viewsets
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
from rest_framework.generics import ListAPIView
import bcrypt
from datetime import date
from django.db import models
from django.core import serializers

from .forms import ImageForm


def image_upload_view(request):
    """Process images uploaded by users"""
    if request.method == 'POST':
        form = ImageForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            # Get the current instance object to display in the template
            img_obj = form.instance
            return render(request, 'index.html', {'form': form, 'img_obj': img_obj})
    else:
        form = ImageForm()
    return render(request, 'index.html', {'form': form})


fs = FileSystemStorage(location='tmp/')
"""
(gokul): the reason i am doing this is to do proper checks at the frontend so to definitely
know what kind of data its getting
"""

# sesonal demand model
ml_sd = SeasonalDemandClassifier()

# dynamic pricing model
ml_dp = DynamicPricing()


class ApiResponseMessageType(Enum):
    CORRECT_EMAIL_AND_PASSWORD = 1
    WRONG_EMAIL_AND_PASSWORD = 2
    WRONG_PASSWORD = 3
    INPUT_FIELD_EMAIL_EMPTY = 4
    INPUT_FIELD_PASSWORD_EMPTY = 5
    UNKNOWN_MESSAGE_TYPE = 6
    USERNAME_ALREADY_TAKEN = 7
    EMAIL_ALREADY_TAKEN = 8
    SIGNUP_SUCCESSFULL = 9

    USER_INVALID = 10

    PRODUCT_FOUND = 11
    NO_PRODUCT_FOUND = 12
    PRODUCT_AVAILABLE_CATEGORIES = 13
    ALL_PRODUCTS_FROM_USER = 14
    PRODUCT_ADDED_SUCCESSFULLY = 20
    PRODUCT_DELETED_SUCCESSFULLY = 21

    def to_string(self):
        return f'{self.name}'


def api_model_response(messagetype: ApiResponseMessageType, data: models.Model = None) -> Response:
    response = {
        'message': messagetype.to_string(),
        'data': serializers.serialize('python', [data]) if data is not None else {}
    }
    print(response)
    return Response(response)


def api_data_response(messagetype: ApiResponseMessageType, serialized_data=None) -> Response:
    response = {
        'message':  messagetype.to_string(),
        'data':     serialized_data if serialized_data is not None else {}
    }
    print(response)
    return Response(response)


@api_view(['POST'])
def login(request):
    data = request.data
    email = data['email']
    password = data['password']
    if email == "":
        return api_model_response(ApiResponseMessageType.INPUT_FIELD_EMAIL_EMPTY)
    elif password == "":
        return api_model_response(ApiResponseMessageType.INPUT_FIELD_PASSWORD_EMPTY)

    for user in User.objects.all():
        if email == user.email:
            if password == user.password:
                return api_model_response(ApiResponseMessageType.CORRECT_EMAIL_AND_PASSWORD, user)
            else:
                return api_model_response(ApiResponseMessageType.WRONG_PASSWORD)
    return api_model_response(ApiResponseMessageType.WRONG_EMAIL_AND_PASSWORD)


def get_role_id(type_name):
    if type_name == "BUYER":
        return 1
    elif type_name == "SELLER":
        return 2
    elif type_name == "BOTH":
        return 3
    print("ILLEGAL TYPE")
    exit(-1)


@api_view(['POST'])
def signup(request):
    data = request.data
    print(data)
    fullname = data['fullname']
    username = data['username']
    dob = data['dob']
    email = data['email']
    password = data['password']
    role = get_role_id(data['role'])
    gstin = 'NIL'
    if role != 1:
        gstin = data['gstin']  
    user_data = User.objects.all()
    for user in user_data:
        if username == user.username:
            return api_model_response(ApiResponseMessageType.USERNAME_ALREADY_TAKEN)
        if email == user.email:
            return api_model_response(ApiResponseMessageType.EMAIL_ALREADY_TAKEN)
    user = User.objects.create(
        fullname=fullname,
        username=username,
        dob=dob,
        email=email,
        password=password,
        role=role,
        gstin=gstin,
    )
    return api_model_response(ApiResponseMessageType.SIGNUP_SUCCESSFULL, user)


@api_view(['POST'])
def delete_user(request):
    data = request.data
    id = data['id']
    user_data = User.objects.all()
    for user in user_data:
        if id == user.id:
            user.delete()
            return Response(f'{id} deleted successfully')
    return Response('username not found')


@api_view(['GET'])
def get_product(request, pid):
    product_data = Product.objects.get(id=pid)
    if (product_data is None):
        return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)

    return api_model_response(ApiResponseMessageType.PRODUCT_FOUND, product_data)


@api_view(['POST'])
def add_product(request):
    data = request.data
    print("Data:",data)
    pname = data['name']
    price = int(data['price'])
    category = data['category']
    quantity = int(data['quantity'])
    status = data['status']
    image = data['image']
    username = data['username']
    print("image:",image)
    if price <= 0:
        return Response('PRODUCT_PRICE_IS_ZERO_OR_LESS')
    if pname == "":
        return Response('PRODUCT_NAME_IS_EMPTY')
    if quantity <= 0:
        return Response('PRODUCT_QUANTITY_IS_ZERO')

    product_data = Product.objects.all()
    for product in product_data:
        if pname == product.name:
            return Response('PRODUCT_ALREADY_EXIST')

    user = User.objects.get(username=username)
    if (user is None):
        return api_model_response(ApiResponseMessageType.USER_INVALID)

    datas = Product.objects.create(
        userid=user,
        name=pname,
        category=category,
        price=price,
        quantity=quantity,
        status=status,
        image=image
    )
    return api_data_response(ApiResponseMessageType.PRODUCT_ADDED_SUCCESSFULLY)


@api_view(['GET'])
def edit_product(request, pid):
    data = request.data
    pname = data['name']
    price = int(data['price'])
    status = data['status']
    quantity = int(data['quantity'])
    if price <= 0:
        return Response('PRODUCT_PRICE_INVALID')
    elif pname == "":
        return Response('PRODUCT_NAME_EMPTY')

    product = Product.objects.get(id=pid)
    if (product is None):
        return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
    product.name = pname
    product.price = price
    product.quantity = quantity
    product.edited_date = date.today()
    product.status = status
    product.save()
    return Response('PRODUCT_EDITED_SUCCESSFULLY')


@api_view(['POST'])
def delete_product(request):
    username = request.data['username']
    pname = request.data['productname']
    user = User.objects.get(username=username)
    product = Product.objects.get(userid=user, name=pname)
    if (product is None):
        return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
    product.delete()
    return api_data_response(ApiResponseMessageType.PRODUCT_DELETED_SUCCESSFULLY)

@api_view(['POST'])
def add_to_cat(request):
    buyer_id = request.data['buyer_id']
    seller_id = request.data['seller_id']
    product_name = request.data['product_name']

    buyer = User.objects.get(username=buyer_id)
    if (buyer is None):
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    seller = User.objects.get(username=seller_id)
    if (seller is None):
        return api_model_response(ApiResponseMessageType.USER_INVALID)

    #product = Product.objects.get(userid.username=seller_id, name=pname)
    product = Product.objects.get(userid=seller,name=product_name)
    if (product is None):
        return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
    if(product.price != price or product.quantity < quantity):
        return Response('INVALID_PRICE_OR_QUANTITY')

    datas = AddToCart.objects.create(
        buyer_id = buyer_id,
        seller_id = seller_id,
        #seller_id = seller_id,
        product_name = product_name,
        product_id = product
    )
    #product.quantity = product.quantity - quantity
    return Response('ADDED_TO_CART')



@api_view(['GET'])
def edit_cart_item(request, order_id):
    data = request.data
    price = int(data['price'])
    quantity = int(data['quantity'])
    buyer_id = request.data['buyer_id']
    seller_id = request.data['seller_id']
    seller = User.objects.get(id=seller_id)
    if (seller is None):
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    buyer = User.objects.get(id=buyer_id)
    if( buyer is None):
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    if price <= 0:
        return Response('PRODUCT_PRICE_INVALID')
    elif quantity <= 0:
        return Response('CART_IS_EMPTY')

    cartProduct = AddToCart.objects.get(id=order_id)
    if (cartProduct is None):
        return Response('SOMETHING_WENT_WRONG')
    cartProduct.price = price
    cartProduct.quantity = quantity
    cartProduct.save()
    #product.quantity = product.quantity - quantity
    return Response('CART_EDITED_SUCCESSFULLY')


@api_view(['POST'])
def delete_cart_item(request):
    order_id = request.data['product_id']
    buyer_id = request.data['buyer_id']
    seller_id = request.data['seller_id']
    seller = User.objects.get(username=seller_id)
    if (seller is None):
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    buyer = User.objects.get(username=buyer_id)
    if( buyer is None):
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    cartProduct = AddToCart.objects.get(id=order_id)
    if (cartProduct is None):
        return Response('SOMETHING_WENT_WRONG')
    cartProduct.delete()
    return Response('REMOVED_FROM_CART')


@api_view(['POST'])
def get_cart_from_a_buyer(request):
    order_id = request.data['order_id']
    buyer_id = request.data['buyer_id']
    seller_id = request.data['seller_id']
    buyer = User.objects.get(username=buyer_id)
    if (buyer is None):
        return api_model_response(ApiResponseMessageType.USER_INVALID)

    seller = User.objects.get(username=seller_id)
    if (seller is None):
        return api_model_response(ApiResponseMessageType.USER_INVALID)

    cartProducts = AddToCart.objects.all().filter(id=order_id, buyer_id=buyer_id)
    serializer = CartSerializer(cartProducts, many=True)
    return api_data_response(ApiResponseMessageType.ALL_PRODUCTS_FROM_USER, serializer.data)


@api_view(['POST'])
def get_available_categories(request):
    return Response(
        Product.get_categories()
    )


@api_view(['POST'])
def get_all_products_from_a_user(request):
    username = request.data['username']
    user = User.objects.get(username=username)
    if (user is None):
        return api_model_response(ApiResponseMessageType.USER_INVALID)

    products = Product.objects.all().filter(userid=user)
    serializer = ProductSerializer(products, many=True)
    return api_data_response(ApiResponseMessageType.ALL_PRODUCTS_FROM_USER, serializer.data)

@api_view(['GET'])
def get_all_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return api_data_response(ApiResponseMessageType.ALL_PRODUCTS_FROM_USER, serializer.data)


@api_view(['POST'])
def get_stock_recommendation(request):
    category = request.data['category']
    return Response(json.dumps(ml_sd.predict_today(category)))


@api_view(['POST'])
def get_stock_recommendation_for_entire_year(request):
    return Response(json.dumps(ml_sd.predict_an_entire_year()))


@api_view(['POST'])
def get_dynamic_price_for_product(request):
    print(request.data)
    demand = int(request.data['demand']) / 100
    date = request.data['date']
    category = request.data['category'].lower()
    return Response(ml_dp.predict(category, demand, date))
