# Generated by Django 4.0.4 on 2023-05-16 18:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_addtocart_issold'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='wallet_balance',
            field=models.PositiveIntegerField(default=500),
        ),
    ]