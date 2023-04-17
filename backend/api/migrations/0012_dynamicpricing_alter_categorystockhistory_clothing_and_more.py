# Generated by Django 4.0.4 on 2022-10-25 04:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_alter_categorystockhistory_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='DynamicPricing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('productsaleprice', models.FloatField()),
                ('purchaseprice', models.FloatField()),
                ('profit', models.FloatField()),
                ('date', models.DateField()),
                ('weekday', models.PositiveIntegerField()),
                ('weekend', models.PositiveIntegerField()),
                ('category', models.PositiveIntegerField()),
                ('demand', models.PositiveIntegerField()),
            ],
        ),
        migrations.AlterField(
            model_name='categorystockhistory',
            name='clothing',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='categorystockhistory',
            name='electronic',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='categorystockhistory',
            name='furniture',
            field=models.PositiveIntegerField(),
        ),
    ]
