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
from django.core.exceptions import ValidationError


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
    NO_PRODUCTS_FROM_USER = 13
    PRODUCT_AVAILABLE_CATEGORIES = 14
    ALL_PRODUCTS_FROM_USER = 15
    PRODUCT_ADDED_SUCCESSFULLY = 20
    PRODUCT_DELETED_SUCCESSFULLY = 21
    WALLET_BALANCE_INSUFFICIENT = 22


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
    try:
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
    except User.DoesNotExist as error:
        print(error)
        return api_model_response(ApiResponseMessageType.USER_INVALID)

    except KeyError:
        return Response("INVALID_HEADER(S)")    


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
    try:
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
    except KeyError:
        return Response("INVALID_HEADER(S)")    


@api_view(['GET'])
def get_user(request, id):
    try:
        user_data = User.objects.get(id=id)
        # print('userdata:',dir(user_data))
        # print(user_data.dob)
        # print(user_data.username)
        # print(user_data.email)
        data = {"username":f"{user_data.username}", 
                "email":f"{user_data.email}",
                "dob":f"{user_data.dob}"
                }
        return Response(data)
    except User.DoesNotExist as error:
        print(error)
        return api_model_response(ApiResponseMessageType.USER_INVALID)

@api_view(['GET'])
def get_wallet(request, userid):
    try:
        user_data = User.objects.get(id=userid)
        # print('userdata:',dir(user_data))
        # print(user_data.dob)
        # print(user_data.username)
        # print(user_data.email)
        data = {"wallet":f"{user_data.wallet_balance}" 
                }
        return Response(data)
    except User.DoesNotExist as error:
        print(error)
        return api_model_response(ApiResponseMessageType.USER_INVALID)



@api_view(['POST'])
def delete_user(request):
    try:
        data = request.data
        id = data['id']
        user_data = User.objects.get(id=id)
        user_data.delete()
        return Response(f'{id} deleted successfully')
    except User.DoesNotExist as error:
        print(error)
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    except KeyError:
        return Response("INVALID_HEADER(S)")    


@api_view(['GET'])
def get_product(request, pid):
    try:
        product_data = Product.objects.get(id=pid)
        if (product_data is None):
            return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
        return api_model_response(ApiResponseMessageType.PRODUCT_FOUND, product_data)
    except Product.DoesNotExist:
        return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
        


@api_view(['POST'])
def add_product(request):
    try:
        data = request.data
        print("Data:",data)
        pname = data['name']
        price = int(data['price'])
        category = data['category']
        quantity = int(data['quantity'])
        status = data['status']
        image = data['image']
        username = data['username']
        # print("image:",image)
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
    except User.DoesNotExist:
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    except Product.DoesNotExist:
        return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
    except KeyError:
        return Response("INVALID_HEADER(S)")    


@api_view(['POST'])
def edit_product(request, pid):
    try:
        data = request.data
        pname = data['name']
        price = int(data['price'])
        status = int(data['status'])
        quantity = int(data['quantity'])
        image  = data['image']
        userid = data['userid']
        # print("edit pro userid:",type(userid))
        user = User.objects.get(id=userid)
        # print(user)
        if (user is None):
            return api_model_response(ApiResponseMessageType.USER_INVALID)
        if price <= 0:
            return Response('PRODUCT_PRICE_INVALID')
        elif pname == "":
            return Response('PRODUCT_NAME_EMPTY')
        product = Product.objects.get(id=pid)
        # print("product.userid.id:",product.userid.id,"!=",user.id)
        if(product.userid.id != user.id ):
            return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
        if (product is None):
            return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
        # print('pname:',type(pname),pname)
        # print('price:',type(price),price)
        # print('quantity:',type(quantity),quantity)
        # print('image:',type(image),image)
        # print('status:',type(status),status)
        # print('userid:',type(userid),userid)
        product.name = pname
        product.price = price
        product.quantity = quantity
        product.edited_date = date.today()
        product.status = status
        print("image:",image,type(image))
        if image != 'null':
            product.image = image
            print("image updated")
        product.save()
        return Response('PRODUCT_EDITED_SUCCESSFULLY')
    except User.DoesNotExist:
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    except Product.DoesNotExist:
        return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
    except KeyError:
        return Response("INVALID_HEADER(S)")    


@api_view(['POST'])
def delete_product(request):
    try:
        username = request.data['username']
        pname = request.data['productname']
        user = User.objects.get(username=username)
        product = Product.objects.get(userid=user, name=pname)
        if (product is None):
            return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
        product.delete()
        return api_data_response(ApiResponseMessageType.PRODUCT_DELETED_SUCCESSFULLY)
    except User.DoesNotExist:
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    except Product.DoesNotExist:
        return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
    except KeyError:
        return Response("INVALID_HEADER(S)")    


# Cart
@api_view(['GET'])
def get_cart(request, order_id):
    try:
        cart_item = AddToCart.objects.get(id=order_id)
        if (cart_item is None):
            return Response('NO_CART_ITEM_FOUND')
        return api_model_response(ApiResponseMessageType.PRODUCT_FOUND, cart_item)
    except AddToCart.DoesNotExist:
        return Response('NO_CART_ITEM_FOUND')

@api_view(['POST'])
def add_cart_item(request):
    try:
        buyer_id = request.data['buyer_id']
        quantity = int(request.data['quantity'])
        product_id = request.data['product_id']
        print("byuyer_id:",buyer_id)
        print("quantity:",quantity)
        print("product_Id:",product_id)
        if (quantity <= 0):
            return Response('INVALID_QUANTITY')
        # if(1):
        print("buy-->")
        buyer = User.objects.get(id=buyer_id)
        if (buyer is None):
            return api_model_response(ApiResponseMessageType.USER_INVALID)
        product = Product.objects.get(id=product_id)
        if (product is None):
            return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
        elif(product.quantity < quantity):
            return Response('INVALID_QUANTITY')
        print("sell->>>")
        seller = User.objects.get(id=product.userid_id)
        if (seller is None):
            return api_model_response(ApiResponseMessageType.USER_INVALID)
        cartProduct = AddToCart.objects.get(buyer_id=buyer_id,product_id=product_id,ispurchased=False)
        # print(':::::',dir(cartProduct),'\n\n\n\n',cartProduct,'\n\n\n\n\n')
        cartProduct.seller_id = seller
        cartProduct.quantity += quantity
        cartProduct.save()
        print('CART_EDITED_SUCCESSFULLY')
        return Response('CART_EDITED_SUCCESSFULLY')
        
    except User.DoesNotExist as error:
        print(error)
        return api_model_response(ApiResponseMessageType.USER_INVALID)

    except AddToCart.DoesNotExist:
        datas = AddToCart.objects.create(
            buyer_id = buyer,
            seller_id = seller,
            quantity = quantity,
            product_id = product
            )
            #product.quantity = product.quantity - quantity
        print('ADDED_TO_CART')
        return Response('ADDED_TO_CART')
    
    except KeyError:
        return Response("INVALID_HEADER(S)")    

    except Exception as error:
        print("new error:",error)
        return Response(f'{error}')

@api_view(['POST'])
def edit_cart_item(request, order_id):
    try:
        data = request.data
        quantity = int(data['quantity'])
        buyer_id = request.data['buyer_id']

        if quantity <= 0:
            return Response('CART_IS_EMPTY')
    
        buyer = User.objects.get(id=buyer_id)
        if( buyer is None):
            return api_model_response(ApiResponseMessageType.USER_INVALID)
        cartProduct = AddToCart.objects.get(id=order_id)
        if (cartProduct is None):
            return Response('SOMETHING_WENT_WRONG')
        elif( quantity > cartProduct.product_id.quantity):
            return Response('INVALID_QUANTITY')
        cartProduct.quantity += quantity
        cartProduct.save()
        return Response('CART_EDITED_SUCCESSFULLY')
    except User.DoesNotExist:
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    except AddToCart.DoesNotExist:
        return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
    except KeyError:
        return Response("INVALID_HEADER(S)")

@api_view(['GET'])
def delete_cart_item(request, order_id):
    try:
        cartProduct = AddToCart.objects.get(id=order_id)
        if (cartProduct is None):
            return Response('SOMETHING_WENT_WRONG')
        cartProduct.delete()
        return Response('REMOVED_FROM_CART')
    except AddToCart.DoesNotExist:
        return Response('SOMETHING_WENT_WRONG')        


@api_view(['POST'])
def buy_cart_item(request):
    try:
        data = request.data
        buyer_id = request.data['buyer_id']
        order_id = request.data['order_id']
        buyer = User.objects.get(id=buyer_id)
        if( buyer is None):
            return api_model_response(ApiResponseMessageType.USER_INVALID)
        
        cartProduct = AddToCart.objects.get(id=order_id)
        if (cartProduct is None):
            return Response('SOMETHING_WENT_WRONG')
        product = Product.objects.get(id=cartProduct.product_id.id)
        if(buyer.wallet_balance < (product.price * cartProduct.quantity)):
            return api_data_response(Api.ApiResponseMessageType.WALLET_BALANCE_INSUFFICIENT)
        else:
            buyer.wallet_balance -= (product.price * cartProduct.quantity)
        cartProduct.ispurchased = True
        cartProduct.save()
        buyer.save()
        return Response('ORDER_PLACED_SUCCESSFULLY')
    except User.DoesNotExist:
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    except Product.DoesNotExist:
        return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)
    except AddToCart.DoesNotExist:
        return Response('SOMETHING_WENT_WRONG')
    except KeyError:
        return Response("INVALID_HEADER(S)")      

@api_view(['POST'])
def sell_cart_item(request):
    # Make this POST to add seller_id
    try:
        seller_id = request.data['seller_id']
        order_id = request.data['order_id']
        print(':sellerId:',seller_id)
        print(':orderId:',order_id)
        cartProduct = AddToCart.objects.get(id=order_id)
        seller = User.objects.get(id=seller_id)
        if( seller is None):
            return api_model_response(ApiResponseMessageType.USER_INVALID)
        if (cartProduct is None):
            return Response('SOMETHING_WENT_WRONG')
        cartProduct.issold = True
        product = Product.objects.get(id=cartProduct.product_id.id)
        print("old quan:",product.quantity)
        print("old wallet:",seller.wallet_balance)
        seller.wallet_balance += (cartProduct.quantity*product.price)
        print("new wallet:",seller.wallet_balance)
        product.quantity -= cartProduct.quantity
        print("new quantity:",product.quantity)
        product.save()
        seller.save()
        cartProduct.save()
        return Response('ORDER_EXECUTED_SUCCESSFULLY')
    
    except User.DoesNotExist as error:
        print(error)
        return api_model_response(ApiResponseMessageType.USER_INVALID)

    except AddToCart.DoesNotExist:
        return Response('CART_NOT_FOUND')
    except Product.DoesNotExist:
        return api_model_response(ApiResponseMessageType.NO_PRODUCT_FOUND)

    except KeyError:
        return Response("INVALID_HEADER(S)")

# checked
@api_view(['POST'])
def get_cart_from_a_buyer(request):
    # if(1):
    try:
        buyer_id = request.data['buyer_id']
        ispurchased = request.data['isPurchased']
        # print('\n\n\n\nbuyer_id:',buyer_id,type(buyer_id))
        # print('\n\n\n\n',ispurchased,type(ispurchased))
        buyer = User.objects.get(id=buyer_id)
        if (buyer is None):
            return api_model_response(ApiResponseMessageType.USER_INVALID)
        # cartProducts = AddToCart.objects.all().filter(buyer_id=buyer_id,ispurchased=ispurchased)
        cartProducts = AddToCart.objects.select_related('product_id').filter(buyer_id=buyer_id, ispurchased=ispurchased)
        # cartProducts = AddToCart.objects.select_related('product_id').filter(buyer_id=buyer_id, ispurchased=ispurchased).values('id', 'buyer_id', 'quantity', 'product_id', 'ispurchased',  'product_id__name', 'product_id__price', 'product_id__image')
        if not cartProducts:
            return api_model_response(ApiResponseMessageType.NO_PRODUCTS_FROM_USER)
        # print('\n\n\n\n',cartProducts,'\n\n\n\n')
        serializer = CartSerializer(cartProducts, many=True)
        return api_data_response(ApiResponseMessageType.ALL_PRODUCTS_FROM_USER, serializer.data)
    except User.DoesNotExist as error:
        print(error)
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    except AddToCart.DoesNotExist:
        return api_model_response(ApiResponseMessageType.NO_PRODUCTS_FROM_USER)
    except ValidationError:
        return Response("INCORRECT_VALUES")
    except KeyError:
        return Response("INVALID_HEADER(S)")

# checked
@api_view(['POST'])
def get_cart_from_a_seller(request):
    try:
        seller_id = request.data['seller_id']
        # print('\n\n\n\nseller_id:',seller_id,type(seller_id))
        seller = User.objects.get(id=seller_id)
        if (seller is None):
            return api_model_response(ApiResponseMessageType.USER_INVALID)
        # cartProducts = AddToCart.objects.all().filter(buyer_id=buyer_id,ispurchased=ispurchased)
        cartProducts = AddToCart.objects.select_related('product_id').filter(seller_id=seller_id,ispurchased=True,issold=False)
        # cartProducts = AddToCart.objects.select_related('product_id').filter(buyer_id=buyer_id, ispurchased=ispurchased).values('id', 'buyer_id', 'quantity', 'product_id', 'ispurchased',  'product_id__name', 'product_id__price', 'product_id__image')
        if not cartProducts:
            return api_model_response(ApiResponseMessageType.NO_PRODUCTS_FROM_USER)
        serializer = CartSerializer(cartProducts, many=True)
        return api_data_response(ApiResponseMessageType.ALL_PRODUCTS_FROM_USER, serializer.data)

    except User.DoesNotExist as error:
        print(error)
        return api_model_response(ApiResponseMessageType.USER_INVALID)

    except AddToCart.DoesNotExist:
        print(error)
        return api_model_response(ApiResponseMessageType.NO_PRODUCTS_FROM_USER)

    except KeyError:
        return Response("INVALID_HEADER(S)")

    except Exception as error:
        print("new error:",error)
        return Response(f'{error}')

# checked
@api_view(['POST'])
def get_available_categories(request):
    # categories = Product.get_categories()
    # print("categories:",categories)

    # for i in categories:
    #     print("iterating:",i[1])
    #     product = Product.objects.get(category=i[0])
    #     print("product name:",product["data"].name,"quantity:",product["data"].quantity)
    
    return Response(
        Product.get_categories()
    )

# checked
@api_view(['POST'])
def get_all_products_from_a_user(request):
    try:
        seller_id = request.data['seller_id']
        user = User.objects.get(id=seller_id)
        if (user is None):
            return api_model_response(ApiResponseMessageType.USER_INVALID)
        products = Product.objects.all().filter(userid=user)
        if (products is None or len(products) == 0):
            return api_model_response(ApiResponseMessageType.NO_PRODUCTS_FROM_USER)
        serializer = ProductSerializer(products, many=True)
        return api_data_response(ApiResponseMessageType.ALL_PRODUCTS_FROM_USER, serializer.data)
    except User.DoesNotExist:
        return api_model_response(ApiResponseMessageType.USER_INVALID)
    except Product.DoesNotExist:
        return api_model_response(ApiResponseMessageType.NO_PRODUCTS_FROM_USER)
    except KeyError:
        return Response("INVALID_HEADER(S)")
    

# checked
@api_view(['GET'])
def get_all_products(request):
    try:
        products = Product.objects.all()
        if (products is None or len(products) == 0):
            return api_model_response(ApiResponseMessageType.NO_PRODUCTS_FROM_USER)
        serializer = ProductSerializer(products, many=True)
        return api_data_response(ApiResponseMessageType.ALL_PRODUCTS_FROM_USER, serializer.data)
    except Product.DoesNotExist:
        return api_model_response(ApiResponseMessageType.NO_PRODUCTS_FROM_USER)


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
