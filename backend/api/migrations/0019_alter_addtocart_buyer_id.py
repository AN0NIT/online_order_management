# Generated by Django 4.0.4 on 2023-04-23 16:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_remove_addtocart_order_id_addtocart_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='addtocart',
            name='buyer_id',
            field=models.CharField(max_length=150),
        ),
    ]
