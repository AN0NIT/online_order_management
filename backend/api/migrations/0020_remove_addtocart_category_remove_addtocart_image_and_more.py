# Generated by Django 4.0.4 on 2023-04-23 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_alter_addtocart_buyer_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='addtocart',
            name='category',
        ),
        migrations.RemoveField(
            model_name='addtocart',
            name='image',
        ),
        migrations.RemoveField(
            model_name='addtocart',
            name='price',
        ),
        migrations.RemoveField(
            model_name='addtocart',
            name='quantity',
        ),
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, upload_to='users/<django.db.models.fields.IntegerField>/<django.db.models.fields.UUIDField>'),
        ),
    ]
