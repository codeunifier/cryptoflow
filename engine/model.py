import keras
import tensorflow as tf
from graph import plot_losses

class CryptoModel:
    __model = None

    def __init__(self):
        print("Initializing model...")

    def create(self, shape):
        print("Creating model...")

        epochs = 100
        self.__model = keras.models.Sequential()

        # 2 layers
        self.__model.add(keras.layers.LSTM(epochs, return_sequences=True, input_shape=(shape[1], shape[2])))
        self.__model.add(keras.layers.LSTM(epochs, input_shape=(shape[1], shape[2])))
        self.__model.add(keras.layers.Dense(1))
        self.__model.compile(loss="mae", optimizer="adam", metrics=['accuracy'])
        # self.__model.compile(loss="binary_crossentropy", optimizer="adam", metrics=['accuracy'])

        # 1 layer
        # self.__model.add(keras.layers.LSTM(epochs, return_sequences=False, input_shape=(shape[1], shape[2])))
        # self.__model.add(keras.layers.Dropout(0.8))
        # self.__model.add(keras.layers.Dense(1))
        # self.__model.add(keras.layers.LeakyReLU())
        # self.__model.compile(loss="mae", optimizer="adam", metrics=['accuracy'])

    def train(self, train_x, train_y, test_x, test_y):
        print("Training model...")
    
        #300 epochs, 100 batch size - rmse would decrease for the first couple rounds but then increase drastically
        #100 epochs, 100 batch size - rmse definitely hangs around in a lower spectrum, almost getting to 400, but toggles between 400 and 550 (best 411)
        #100 epochs, 150 batch size - about the same as above (best 413)
        #150 epochs, 100 batch size - acted the same as with 300 epoches (best 412)
        #50 epochs, 100 batch size - much more sporratic results (best 414)
        #120 epochs, 100 batch size - same as 150 and 300 epochs (best 409)
        #return self.__model.fit(train_x, train_y, epochs=100, batch_size=200, validation_data=(test_x, test_y), verbose=0, shuffle=False)#, callbacks=[plot_losses])
        return self.__model.fit(train_x, train_y, epochs=200, batch_size=100, validation_data=(test_x, test_y), verbose=0, shuffle=False)#, callbacks=[plot_losses])
    
    def predict(self, x):
        print("Making prediction...")
        return self.__model.predict(x)