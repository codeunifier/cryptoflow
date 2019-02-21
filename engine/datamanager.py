import csv
import requests
import json
 
class DataManager:
    """
    To download the data from kaggle, use "kaggle datasets download download sudalairajkumar/cryptocurrencypricehistory -f bitcoin_price.csv"
    in a command prompt
    """
    def save_to_csv_file(self, data, filepath):
        with open(filepath, 'w', newline="") as my_file:
            writer = csv.writer(my_file)
            writer.writerows(data)
    def read_from_csv_file(self, filepath):
        data = []
        with open(filepath, 'r') as my_file:
            reader = csv.reader(my_file)
            for row in reader:
                data.append(row)
        return data
    def save_to_json_file(self, data, filepath):
        with open(filepath, 'w') as my_file:
            json.dump(data, my_file)
    def read_from_json_file(self, filepath):
        with open(filepath, 'r') as my_file:
            return json.load(my_file)
        
