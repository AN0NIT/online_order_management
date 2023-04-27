# Generated by Django 4.2 on 2023-04-27 09:20

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_remove_addtocart_category_remove_addtocart_image_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='addtocart',
            name='product_name',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AddField(
            model_name='addtocart',
            name='seller_id',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AlterField(
            model_name='addtocart',
            name='buyer_id',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, upload_to=api.models.upload_to),
        ),
    ]
