from api.models import CategoryStockHistory
from ml.models import SeasonalDemandClassifier, DynamicPricing
from datetime import datetime
import pandas as pd
import random 
#from prophet import Prophet


def run_sd():

    ml = SeasonalDemandClassifier()

    # print("perdictiong")
    # print(ml.predict_today('clothing'))
    # print(ml.predict_today('furniture'))
    # print(ml.predict_today('electronic'))

    print(ml.predict_an_entire_year())


def run_dp():
    ml =  DynamicPricing()
    # category, demand, date
    today = datetime.now() 
    
    categories = ["Clothing","Electronics","Furniture"]
    category = random.choice(categories)
    date = today.strftime("%d-%m-%Y") 
    demand = random.randint(1,5)
    #print(f"category:{category}\ndemand:{demand}\ndate:{date}\n")
    
    print(ml.predict(category,demand,date))


def run():
    #run_sd()
    run_dp()