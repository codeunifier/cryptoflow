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

my_model = CryptoModel()
my_model.load()

#last_prediction = [[0.5604354]]
last_prediction = [[9998.518]]

shaped_prediction = np.reshape(last_prediction, (1,1,1))

#print(my_model.summarize())

result = my_model.predict(shaped_prediction)

print(result)