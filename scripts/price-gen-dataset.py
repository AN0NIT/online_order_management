#!/bin/python3
from datetime import date, timedelta, datetime
import random
from enum import Enum
import joblib
import pandas as pd
import csv

def is_weekend(day : date) -> bool:
    if day.weekday() < 5:
        return False;
    else:
        return True;

def dates_from_range(start_date : date, end_date : date) -> list :
    output = list()
    delta = timedelta(days=1)
    while start_date < end_date:
        weekend = is_weekend(start_date)
        output.append({
            "date"      : start_date.strftime("%d-%m-%Y"),
            "weekday"   : int(not weekend),
            "weekend"   : int(weekend)
        })
        start_date += delta
    return output;

def years_from_range(start_date : date, end_date : date) -> list :
    output = list()
    syear = int(start_date.strftime("%Y"))
    eyear = int(end_date.strftime("%Y"))

    while syear < eyear:
        output.append(syear)
        syear = syear + 1
    return output;

def random_values_from_range(start : float, end: float, precision: int, limit: int) -> list:
    output = list()
    for _ in range(limit):
        output.append(round(random.uniform(start, end), precision))
    return output

class Category(Enum):
    ELECTRONIC = 1
    FURNITURE = 2
    CLOTHING = 3

    def __str__(self):
        return self.name
    def __int__(self):
        return self.value


def demands_for_years() -> list:
    outputs = list()

    with open('./trendy.csv', 'r') as file:

        csvfile = csv.reader(file)
        next(csvfile)

        for row in csvfile:

            outputs.append({
                "CLOTHING"      : row[2],
                "ELECTRONIC"    : row[3],
                "FURNITURE"     : row[4],
            })

    return outputs


def main():
    DATES           = dates_from_range(date(2016, 1, 1), date(2020, 1, 1))
    YEARS           = years_from_range(date(2016, 1, 1), date(2020, 1, 1))
    NDAYS           = len(DATES)
    CATEGORYS       = [1,2,3]
    PROFITS         = random_values_from_range(-5.0, 7.0, 7, NDAYS)
    PURCHASE_PRICE  = random_values_from_range(6.0, 9.8, 1, NDAYS)
    PRODUCT_SALE    = random_values_from_range(0, 70, 1, NDAYS)
    DEMANDS         = demands_for_years()

    HEADER = ["SI", "ProductSale", "PurchasePrice", "Profit", "date", "weekday",
            "weekend", "Category", "demand" ]

    with open('gokul-demand-price-dataset.csv', 'w', newline='', encoding='UTF8') as file:
        writer = csv.writer(file)
        writer.writerow(HEADER)
        counter = 0
        old_month = 1
        month_counter = 0 
        for i in range(NDAYS):
            month = int(DATES[i]["date"].split('-')[-2])
            if (month != old_month):
                old_month = month;
                month_counter = month_counter + 1

            for category in Category:
                writer.writerow([
                    counter, 
                    PRODUCT_SALE[i], 
                    PURCHASE_PRICE[i], 
                    PROFITS[i], 
                    DATES[i]["date"],
                    DATES[i]["weekday"],
                    DATES[i]["weekend"],
                    int(category),
                    int(DEMANDS[month_counter][str(category)]),
                ])
                counter = counter + 1
            

if __name__ == '__main__':
    main()
