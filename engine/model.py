import keras
import tensorflow as tf
from graph import plot_losses

"""
Sources:
https://stackoverflow.com/questions/48760472/how-to-use-the-keras-model-to-forecast-for-future-dates-or-events
"""

class CryptoModel:
    __model = None

    def __init__(self):
        print("Initializing model...")

    def create(self, shape):
        print("Creating model...")

        units = 50
        dropout_value = 0.2 # 20% dropout to fight against overfitting
        self.__model = keras.models.Sequential()

        # 2 layers
        self.__model.add(keras.layers.LSTM(units, return_sequences=True, input_shape=(shape[1], shape[2])))
        # self.__model.add(keras.layers.Dropout(dropout_value))
        self.__model.add(keras.layers.LSTM(units, input_shape=(shape[1], shape[2])))
        #self.__model.add(keras.layers.Dropout(dropout_value))
        self.__model.add(keras.layers.Dense(1)) #1 = a single output node
        self.__model.compile(loss="mse", optimizer="adam", metrics=['accuracy'])
        # self.__model.compile(loss="binary_crossentropy", optimizer="adam", metrics=['accuracy'])

        # 2 layers stateful
        #self.__model.add(keras.layers.LSTM(units, return_sequences=True, batch_input_shape=(1, 1, 1), stateful=True))
        #self.__model.add(keras.layers.LSTM(units, batch_input_shape=(1,1,1), stateful=True))
        #self.__model.add(keras.layers.Dense(1)) #1 = a single output node
        #self.__model.compile(loss="mse", optimizer="adam", metrics=['accuracy'])

    def train(self, train_x, train_y, test_x, test_y):
        print("Training model...")
    
        #300 epochs, 100 batch size - rmse would decrease for the first couple rounds but then increase drastically
        #100 epochs, 100 batch size - rmse definitely hangs around in a lower spectrum, almost getting to 400, but toggles between 400 and 550 (best 411)
        #100 epochs, 150 batch size - about the same as above (best 413)
        #150 epochs, 100 batch size - acted the same as with 300 epoches (best 412)
        #50 epochs, 100 batch size - much more sporratic results (best 414)
        #120 epochs, 100 batch size - same as 150 and 300 epochs (best 409)

        #verbosity - 0 = silent, 1 = progress bar, 2 = one line per epoch
        return self.__model.fit(train_x, train_y, epochs=100, batch_size=200, validation_data=(test_x, test_y), verbose=0, shuffle=False)
        #return self.__model.fit(train_x, train_y, epochs=100, batch_size=200, validation_split=0.3, verbose=1, shuffle=False)
    
    def predict(self, x):
        print("Making prediction...")
        return self.__model.predict(x)
    
    def reset(self):
        self.__model.reset_states()

    def save(self):
        print("Saving model...")
        self.__model.save("my_model.h5")

    def load(self):
        print("Loading model...")
        self.__model = keras.models.load_model("my_model.h5")
    
    def summarize(self):
        return self.__model.summary()
    
    def evaluate(self, d, l):
        return self.__model.evaluate(d, l)