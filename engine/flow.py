"""
Resources: 
https://www.kaggle.com/pmarcelino/comprehensive-data-exploration-with-python
https://activewizards.com/blog/bitcoin-price-forecasting-with-deep-learning-algorithms/
https://medium.com/@huangkh19951228/predicting-cryptocurrency-price-with-tensorflow-and-keras-e1674b0dc58a
https://machinelearningmastery.com/time-series-prediction-lstm-recurrent-neural-networks-python-keras/
https://www.kaggle.com/jphoon/bitcoin-time-series-prediction-with-lstm
https://machinelearningmastery.com/stacked-long-short-term-memory-networks/
https://machinelearningmastery.com/diagnose-overfitting-underfitting-lstm-models/
https://nicholastsmith.wordpress.com/2017/11/13/cryptocurrency-price-prediction-using-deep-learning-in-tensorflow/
http://androidkt.com/predic-cryptocurrency-price-tensorflow-keras/ - garbage

"""
#this is on dev
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

look_back = 1

def create_dataset(dataset, look_back = 1):
    #function taken from https://activewizards.com/blog/bitcoin-price-forecasting-with-deep-learning-algorithms/
    #also found here: https://www.kaggle.com/ternaryrealm/lstm-time-series-explorations-with-keras
    # What this is doing is offsetting the data by look_back, so that any given input should be predicting the next value
    # I think it makes sense when thinking about it, but I don't think that's how a machine learning model is supposed to work
    dataX, dataY = [], []
    for i in range(len(dataset) - look_back):
        a = dataset[i:(i + look_back), 0]
        dataX.append(a)
        dataY.append(dataset[i + look_back, 0])
    return np.array(dataX), np.array(dataY)

#read in the original data reversed so the earliest dates are first
original_data = pd.read_csv("./data/bitcoin_price.csv").iloc[::-1]

#or don't do that because then the test data is the oldest crap
# original_data = pd.read_csv("./data/bitcoin_price.csv")

#visualize some of the original data
print("Original data:")
print(original_data.head(10))
print()

#convert the date into a timestamp
original_data["timestamp"] = [datetime.datetime.strptime(date, "%b %d, %Y").timestamp() for date in original_data["Date"]]

new_train_data = original_data.sample(frac=0.8, random_state=0)
new_test_data = original_data.drop(new_train_data.index)

print("New Train Data:")
print(new_train_data.head(10))
print("New Test Data:")
print(new_test_data.head(10))
# print("Converted original data:")
# print(original_data.head(10))
# print()

new_train_stats = new_train_data.describe()
new_train_stats.pop("Close")
new_train_stats = new_train_stats.transpose()
print("Transposed training data stats:")
print(new_train_stats)

train_labels = new_train_data.pop("Close")
test_labels = new_test_data.pop("Close")

print("TEST LABELS")
print(test_labels)

#scale the price data to lie between 0 and 1
values = original_data["Close"].values.reshape(-1, 1)
values = values.astype('float32')
scaler = MinMaxScaler(feature_range=(0, 1))
scaled = scaler.fit_transform(values)

scaled_train_labels = scaler.fit_transform(train_labels.values.reshape(-1, 1).astype('float32'))
scaled_test_labels = scaler.fit_transform(test_labels.values.reshape(-1, 1).astype('float32'))

print("Scaled close data:")
print(scaled)
print()

# print("Scaled new train labels:")
# print(scaled_train_labels)
# print("Scaled new test labels:")
# print(scaled_test_labels)

normed_train_data = (new_train_data['timestamp'] - new_train_stats['mean']) / new_train_stats['std']
normed_test_data = (new_test_data['timestamp'] - new_train_stats['mean'] / new_train_stats['std'])

print("Normalized train data:")
print(normed_train_data)

#split data into train and test sets
train_size = int(len(scaled) * .7) - ((int(len(scaled) * .7) % 200) - 1)
train_data = scaled[0:train_size,:] 
test_data = scaled[train_size:len(scaled),:]
# while len(test_data) % 200 > 0:
#     print("adding null value")
#     test_data.append(None)
print("Train size: %d" % (len(train_data)))
print("Test size: %d" % (len(test_data)))

#create the dataset
train_x, train_y = create_dataset(train_data, look_back)
test_x, test_y = create_dataset(test_data, look_back)

# print("\n\nBefore reshaping")
# print(train_x)
# print(test_x)

#reshape the input data for model training
train_x = np.reshape(train_x, (train_x.shape[0], 1, train_x.shape[1]))
test_x = np.reshape(test_x, (test_x.shape[0], 1, test_x.shape[1]))

# print("After reshaping")
# print(train_x)
# print(test_x)
# print("\n")

rmse = 10000
max_attempts = 5
round_num = 1
best_prediction = None
best_prediction_transformed = None
best_model = None
best_rmse = 10000
final_actual = scaler.inverse_transform(test_y.reshape(-1,1))
loss_result = pd.DataFrame()
val_result = pd.DataFrame()
acc_result = pd.DataFrame()
val_acc_result = pd.DataFrame()

for i in range(0, max_attempts):
    print("Round %d/%d" % (round_num, max_attempts))

    #create the model
    my_model = CryptoModel()
    my_model.create(train_x.shape)

    #train the model
    history = my_model.train(train_x, train_y, test_x, test_y)

    #make prediction using test_x and plotting line graph against test_y
    prediction_y = my_model.predict(test_x)

    #scaler inverse y back to normal value
    prediction = prediction_y

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
        best_prediction_transformed = scaler.inverse_transform(prediction_y.reshape(-1,1))
        best_model = my_model

    round_num += 1

#plot with real values
graph_predictions_against_actual(best_prediction_transformed, final_actual)

print("\nBest RMSE: %.3f\n" % (best_rmse))

graph_loss_against_validation(loss_result, val_result)

graph_accuracy_against_validation(acc_result, val_acc_result)

#save the best model
#best_model.save("my_model_%d.h5" % look_back)

print("Finished.")