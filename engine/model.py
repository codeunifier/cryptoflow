import keras
import tensorflow as tf
from graph import plot_losses
import os

"""
Sources:
https://stackoverflow.com/questions/48760472/how-to-use-the-keras-model-to-forecast-for-future-dates-or-events
"""

class CryptoModel:
    __model = None

    def create(self, shape):
        units = 50
        self.__model = keras.models.Sequential()

        # 2 layers
        self.__model.add(keras.layers.LSTM(units, return_sequences=True, input_shape=(shape[1], shape[2])))
        self.__model.add(keras.layers.LSTM(units, input_shape=(shape[1], shape[2])))
        self.__model.add(keras.layers.Dense(1)) #1 = a single output node
        self.__model.compile(loss="mse", optimizer="adam", metrics=['accuracy'])

    def train(self, train_x, train_y, test_x, test_y):
        #verbosity - 0 = silent, 1 = progress bar, 2 = one line per epoch
        return self.__model.fit(train_x, train_y, epochs=100, batch_size=200, validation_data=(test_x, test_y), verbose=0, shuffle=False)
    
    def predict(self, x):
        return self.__model.predict(x)
    
    def reset(self):
        self.__model.reset_states()

    def save(self, name = "my_model.h5"):
        my_path = os.path.abspath(os.path.dirname(__file__))
        file_path = os.path.join(my_path, "./data/models/" + name)
        self.__model.save(file_path)

    def load(self, name = "my_model.h5"):
        my_path = os.path.abspath(os.path.dirname(__file__))
        file_path = os.path.join(my_path, "./data/models/" + name)
        self.__model = keras.models.load_model(file_path)
    
    def summarize(self):
        return self.__model.summary()
    
    def evaluate(self, d, l):
        return self.__model.evaluate(d, l)