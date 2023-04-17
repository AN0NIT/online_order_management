# Generated by Django 3.2.9 on 2022-09-29 09:02

import datetime
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200, unique=True)),
                ('price', models.FloatField()),
                ('category', models.IntegerField(choices=[(1, 'ELECTRONIC'), (2, 'FURNITURE'), (3, 'CLOTHING')])),
                ('status', models.IntegerField(choices=[(0, 'INACTIVE'), (1, 'ACTIVE')], default=(1, 'ACTIVE'))),
                ('quantity', models.PositiveBigIntegerField(default=1)),
                ('added_date', models.DateField(default=datetime.date.today)),
                ('edited_date', models.DateField(default=datetime.date.today)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=150)),
                ('fullname', models.CharField(max_length=200)),
                ('dob', models.CharField(max_length=10)),
                ('email', models.CharField(max_length=200)),
                ('password', models.CharField(max_length=200)),
                ('role', models.IntegerField(choices=[(1, 'BUYER'), (2, 'SELLER'), (3, 'BOTH')], default=1)),
                ('added_date', models.DateField(default=datetime.date.today)),
            ],
        ),
    ]
