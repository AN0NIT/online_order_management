from api.models import CategoryStockHistory
import csv
import uuid
import datetime


def yyyy_mm_dd_convert(date: str):
    output = ""
    tmp = date.split('-')
    return tmp[2] + '-' + tmp[1] + '-' + tmp[0]


def run():
    with open('dataset/trendy.csv') as file:
        reader = csv.reader(file)
        next(reader)  # Advance past the header

        CategoryStockHistory.objects.all().delete()
        for row in reader:
            film = CategoryStockHistory(
                str(uuid.uuid4()), yyyy_mm_dd_convert(row[1]), row[2], row[3], row[4])
            film.save()
            print(film)
