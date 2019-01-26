import pandas as pd
import datetime
from sklearn.utils import shuffle
from sklearn.preprocessing import MinMaxScaler
from datamanager import DataManager

#read in the data
full_data = pd.read_csv("./data/bitcoin_price.csv")

#change the date into a timestamp format
#full_data["timestamp"] = [datetime.datetime.strptime(date, "%b %d, %Y").timestamp() for date in full_data["Date"]]

#shuffle it up a bit
#TODO: check if I need to actually do this - with a LSTM model I'd imagine I still want to shuffle, 
#   but I think I need more variables in my model than just the Closing price
#full_data = shuffle(full_data)

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