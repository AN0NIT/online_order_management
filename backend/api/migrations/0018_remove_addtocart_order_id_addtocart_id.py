# Generated by Django 4.0.4 on 2023-04-23 16:34

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_addtocart'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='addtocart',
            name='order_id',
        ),
        migrations.AddField(
            model_name='addtocart',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
