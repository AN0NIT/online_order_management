from django.db import models
from datetime import date
import uuid
from django.utils.html import mark_safe
from pandas import DataFrame
# Create your models here.


def upload_to(instance, filename):
    #return 'images/{filename}'.format(filename=filename)
    return '/'.join(['content', str(instance.userid.id),filename])

class Image(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='images')

    def __str__(self):
        return self.title


class User(models.Model):
    """
    can add more fields, these are just the boilerplate
    """
    USER_TYPES = (
        (1, 'BUYER'),
        (2, 'SELLER'),
        (3, 'BOTH')
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150)
    fullname = models.CharField(max_length=200)
    dob = models.CharField(max_length=10)
    email = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    role = models.IntegerField(choices=USER_TYPES, default=1)
    added_date = models.DateField(default=date.today)
    gstin = models.CharField(max_length=15)
    def get_user_type(self):
        return self.role

    def __str__(self):
        return self.username


class Product(models.Model):
    """
    can add more fields, these are just the boilerplate
    """
    PRODUCT_CATEGORY = (
        (1, 'ELECTRONIC'),
        (2, 'FURNITURE'),
        (3, 'CLOTHING')
    )
    PRODUCT_STATUS = (
        (0, 'INACTIVE'),
        (1, 'ACTIVE'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userid = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, unique=True)
    price = models.FloatField()
    category = models.IntegerField(choices=PRODUCT_CATEGORY, null=False)
    status = models.IntegerField(
        choices=PRODUCT_STATUS, null=False, default=PRODUCT_STATUS[1])
    quantity = models.PositiveBigIntegerField(default=1)
    #image = models.ImageField(upload_to='users/%Y/%m/%d/', blank=True)
    image = models.ImageField(upload_to=upload_to, blank=True)
    # image = models.ImageField(upload_to=upload_to, blank=True, null=True)
    added_date = models.DateField(default=date.today)
    edited_date = models.DateField(default=date.today)

    def get_categories():
        return Product.PRODUCT_CATEGORY

    def get_seller(self):
        return self.userid.username

    def __str__(self):
        return self.name

class AddToCart(models.Model):
    PRODUCT_CATEGORY = (
        (1, 'ELECTRONIC'),
        (2, 'FURNITURE'),
        (3, 'CLOTHING')
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    #buyer_id = models.ForeignKey(User, on_delete=models.CASCADE)
    #seller_id = models.ForeignKey(User, on_delete=models.CASCADE)
    buyer_id =  models.ForeignKey(User, on_delete=models.CASCADE,related_name='buyer_cart')
    seller_id =  models.ForeignKey(User, on_delete=models.CASCADE,related_name='seller_cart')
    quantity = models.PositiveBigIntegerField(default=1)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE) 
    def get_seller(self):
        return self.product_id.username

    def get_buyer(self):
        return self.buyer_id.username

    def get_price(self):
        return self.product_id.price

    

class CategoryStockHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField(unique=True)

    # add more categories under here
    clothing = models.PositiveIntegerField()
    furniture = models.PositiveIntegerField()
    electronic = models.PositiveIntegerField()

    def dataframe():
        return DataFrame.from_records(CategoryStockHistory.objects.all().values())

    def __str__(self):
        return str(self.date)
