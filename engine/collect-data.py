import pandas as pd
import datetime
from sklearn.utils import shuffle
from sklearn.preprocessing import MinMaxScaler
from datamanager import DataManager

#read in the data
full_data = pd.read_csv("./data/bitcoin_price.csv")

#scale the price data to lie between 0 and 1
values = full_data["Close"].values.reshape(-1, 1)
values = values.astype('float32')
scaler = MinMaxScaler(feature_range=(0, 1))
scaled = scaler.fit_transform(values)

train_size = int(len(scaled) * .7)
test_size = len(scaled) - train_size
train_data, test_data = scaled[0:train_size,:], scaled[train_size:len(scaled),:]

print("Training data size: %d" % (len(train_data)))
print("Testing data size: %d" % (len(test_data)))

#save the data sets
data_manager = DataManager()

print("Writing data to files...")
data_manager.save_to_csv_file(train_data, "./data/train/train.csv")
data_manager.save_to_csv_file(test_data, "./data/test/test.csv")
print("Done.")