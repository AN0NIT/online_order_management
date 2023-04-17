from api.models import DynamicPricing
import csv

def run():
    with open('dataset/price_optimize.csv') as file:
        reader = csv.reader(file)
        next(reader)  # Advance past the header
        # ProductSalePrice,PurchasePrice,Profit,date,weekday,weekend,Category,demand
        DynamicPricing.objects.all().delete()
        for row in reader:
            datas = DynamicPricing(
                row[1],row[2],row[3],row[4],row[5],row[6],row[7],row[8])
            datas.save()
            print(datas)
