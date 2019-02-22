import pandas as pd
import numpy as np
import time
import datetime
import keras
import tensorflow as tf
from math import sqrt
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error
from sklearn.metrics import mean_absolute_error
import requests 
from model import CryptoModel
from datamanager import DataManager
import os
import sys

def predict(historicalData, currentData):
    #pull today's opening price 

    #data_manager = DataManager()

    #r = requests.get(url="https://api.coindesk.com/v1/bpi/currentprice.json")
    #my_path = os.path.abspath(os.path.dirname(__file__))
    #json_file_path = os.path.join(my_path, "./data/current/current.json")
    #data_manager.save_to_json_file(r.json(), json_file_path)
    #current_data = data_manager.read_from_json_file(json_file_path)
    #price_today = current_data["bpi"]["USD"]["rate_float"]

    #normalize the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    today_normalized = scaler.fit_transform(np.reshape(currentData, (-1,1)))

    #print("Today's price is: $%.2f" % (price_today))

    #load the model
    my_model = CryptoModel()
    my_model.load()

    today_shaped = np.reshape(today_normalized, (1,1,1))

    result = my_model.predict(today_shaped)

    #revert result to normal scale
    result_rescaled = scaler.inverse_transform(result)

    print(result_rescaled[0][0])

if __name__ == '__main__':
    predict(sys.argv[1], sys.argv[2])