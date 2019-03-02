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
import demjson

def predict(historicalData, lookback):
    #in javascript, the server tosses today's price at the end of historicalData
    data = []
    historicalData = demjson.decode(historicalData)

    #convert the historical data object into data array
    for key in historicalData:
        data.append(historicalData[key])

    data = data[len(data) - int(lookback):]

    #normalize the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    noramlized = scaler.fit_transform(np.reshape(data, (-1,1)))

    #load the model
    my_model = CryptoModel()
    my_model.load("my_model_" + lookback + ".h5")

    #shaped = np.reshape(noramlized, (1,1,1))
    shaped = np.reshape(noramlized, (1,1,int(lookback)))

    result = my_model.predict(shaped)

    #revert result to normal scale
    result_rescaled = scaler.inverse_transform(result)

    print(result_rescaled[0][0])

if __name__ == '__main__':
    predict(sys.argv[1], sys.argv[2])