from unittest import result
import joblib
import pandas as pd
from datetime import datetime
import calendar

RESEARCH_PATH = 'ml/research/'


class SeasonalDemandClassifier:
    def __init__(self):
        self.prophet = dict()
        self.prophet['CLOTHING'] = joblib.load(
            RESEARCH_PATH + 'prophet_clothing.joblib')
        self.prophet['FURNITURE'] = joblib.load(
            RESEARCH_PATH + 'prophet_furniture.joblib')
        self.prophet['ELECTRONIC'] = joblib.load(
            RESEARCH_PATH + 'prophet_electronic.joblib')

    def predict(self, category: str):
        p = None
        try:
            p = self.prophet[category.upper()]
        except Exception as e:
            print("Invalid category", str(e))
            return None

        future = p.make_future_dataframe(15, freq='MS')
        forecast = p.predict(
            future)[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
        return forecast

    def predict_today(self, category: str):
        forecast = self.predict(category)
        month = datetime.now().month
        year = datetime.now().year
        row = forecast.loc[forecast['ds'] == f"{year}-{month}-01"]
        return {
            "date": f"01-{month}-{year}",
            "category": category,
            "min": round(row['yhat_lower'].values[0]),
            "max": round(row['yhat_upper'].values[0]),
            "avg": round(row['yhat'].values[0])
        }

    def predict_an_entire_year(self):
        clothing = self.predict("clothing")
        furniture = self.predict("furniture")
        electronic = self.predict("electronic")

        year = datetime.now().year
        crows = clothing.loc[(clothing['ds'].dt.year ==
                             year) & (clothing['ds'].dt.day == 1)]
        frows = furniture.loc[(furniture['ds'].dt.year ==
                              year) & (furniture['ds'].dt.day == 1)]
        erows = electronic.loc[(electronic['ds'].dt.year ==
                                year) & (electronic['ds'].dt.day == 1)]

        clist = crows.values.tolist()
        elist = erows.values.tolist()
        flist = frows.values.tolist()

        output = list()
        for i in range(12):
            output.append({
                "name": calendar.month_name[i+1][0:3],
                "Clothing": round(clist[i][1]),
                "Furniture": round(flist[i][1]),
                "Electronic": round(elist[i][1]),
            })

        return output


class DynamicPricing:
    """
    (AN0NIT):
    DP Model working fine, tested.
    TODO: convert the demand data.
    """

    def __init__(self):
        self.dp = joblib.load(
            RESEARCH_PATH + 'dynamic_price.joblib')
        self.categories = {"clothing": 0, "electronic": 1, "furniture": 2}

    def check_weekday(self, date):
        # format is DD-MM-YYYY
        myDate = datetime.strptime(date, "%d-%m-%Y")
        weekno = myDate.weekday()
        if weekno < 5:
            weekday = 1
            weekend = 0
        else:
            weekday = 0
            weekend = 1
        return weekday, weekend

    def get_category(self, category):
        return self.categories[category.lower()]

    def predict(self, category, demand, date):
        """
        (AN0NIT):
        category is the name of item {clothing, electronics, furniture} in this order.
        demand ; get the demand from the seasonal demand , divide it by 100 before passing to the dp model.
        date; get it in the form of DD-MM-YYYY
        """

        p = None
        try:
            p = self.dp
        except Exception as e:
            print("Invalid category", str(e))
            return None

        # get 0/1 value for weekday and weekend variable to be passed to the model
        weekday, weekend = self.check_weekday(date)

        # category right now is a string, converting it to 0,1,2
        category = self.get_category(category)

        # converting the result of predict from dataframe to list
        result = p.predict([[category, demand, weekday, weekend]]).tolist()
        dp_price = result[0]
        return dp_price
