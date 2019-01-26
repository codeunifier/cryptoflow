"""
Resources: 
https://www.kaggle.com/pmarcelino/comprehensive-data-exploration-with-python
https://activewizards.com/blog/bitcoin-price-forecasting-with-deep-learning-algorithms/
https://medium.com/@huangkh19951228/predicting-cryptocurrency-price-with-tensorflow-and-keras-e1674b0dc58a
https://machinelearningmastery.com/time-series-prediction-lstm-recurrent-neural-networks-python-keras/
https://www.kaggle.com/jphoon/bitcoin-time-series-prediction-with-lstm
https://machinelearningmastery.com/stacked-long-short-term-memory-networks/
https://machinelearningmastery.com/diagnose-overfitting-underfitting-lstm-models/

Kaggle command to download data:
kaggle datasets download download sudalairajkumar/cryptocurrencypricehistory -f bitcoin_price.csv
"""

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

from model import CryptoModel
from graph import *

def create_dataset(dataset, look_back = 1):
    dataX, dataY = [], []
    for i in range(len(dataset) - look_back):
        a = dataset[i:(i + look_back), 0]
        dataX.append(a)
        dataY.append(dataset[i + look_back, 0])
    print(len(dataY))
    return np.array(dataX), np.array(dataY)

#read in the original data reversed so the earliest dates are first
original_data = pd.read_csv("./data/bitcoin_price.csv").iloc[::-1]

#visualize some of the original data
print("Original data:")
print(original_data.head(10))
print()

#convert the date into a timestamp
original_data["timestamp"] = [datetime.datetime.strptime(date, "%b %d, %Y").timestamp() for date in original_data["Date"]]

print("Converted original data:")
print(original_data.head(10))
print()

#scale the price data to lie between 0 and 1
values = original_data["Close"].values.reshape(-1, 1)
values = values.astype('float32')
scaler = MinMaxScaler(feature_range=(0, 1))
scaled = scaler.fit_transform(values)

print("Scaled data:")
print(scaled)
print()

#split data into train and test sets
train_size = int(len(scaled) * .7)
test_size = len(scaled) - train_size
train_data, test_data = scaled[0:train_size,:], scaled[train_size:len(scaled),:]
print(len(train_data), len(test_data))

#create the dataset
look_back = 1
train_x, train_y = create_dataset(train_data, look_back)
test_x, test_y = create_dataset(test_data, look_back)

#reshape X for model training
train_x = np.reshape(train_x, (train_x.shape[0], 1, train_x.shape[1]))
test_x = np.reshape(test_x, (test_x.shape[0], 1, test_x.shape[1]))

rmse = 10000
max_attempts = 5
round_num = 1
best_prediction = None
best_rmse = 10000
final_actual = scaler.inverse_transform(test_y.reshape(-1,1))
loss_result = pd.DataFrame()
val_result = pd.DataFrame()
acc_result = pd.DataFrame()
val_acc_result = pd.DataFrame()

for i in range(0, max_attempts):
    print("Round %d/%d" % (round_num, max_attempts))

    #create the model
    #model = create_model(train_x.shape)
    my_model = CryptoModel()
    my_model.create(train_x.shape)

    #train the model
    history = my_model.train(train_x, train_y, test_x, test_y)

    #make prediction using test_x and plotting line graph against test_y
    prediction_y = my_model.predict(test_x)

    #scaler inverse y back to normal value
    prediction = scaler.inverse_transform(prediction_y.reshape(-1,1))

    rmse = sqrt(mean_squared_error(final_actual, prediction))
    mae = sqrt(mean_absolute_error(final_actual, prediction))
    print("Root Mean Squared Error: %.3f" % (rmse))
    print("Mean Absolute Error: %.3f" % (mae))
    print()

    #store the training history data
    loss_result[str(i)] = history.history["loss"]
    val_result[str(i)] = history.history["val_loss"]
    acc_result[str(i)] = history.history["acc"]
    val_acc_result[str(i)] = history.history["val_acc"]

    if rmse < best_rmse:
        best_rmse = rmse
        best_prediction = prediction

    round_num += 1

#plot with real values
graph_predictions_against_actual(best_prediction, final_actual)

print("\nBest RMSE: %.3f\n" % (best_rmse))

graph_loss_against_validation(loss_result, val_result)

graph_accuracy_against_validation(acc_result, val_acc_result)