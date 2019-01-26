from matplotlib import pyplot as plt
import keras

class PlotLosses(keras.callbacks.Callback):
    def on_train_begin(self, logs={}):
        self.i = 0
        self.x = []
        self.losses = []
        self.val_losses = []
        self.fig = plt.figure()
        self.logs = []

    def on_epoch_end(self, epoch, logs={}):
        self.logs.append(logs)
        self.x.append(self.i)
        self.losses.append(logs.get('loss'))
        self.val_losses.append(logs.get('val_loss'))
        self.i += 1

        plt.plot(self.x, self.losses, label="loss")
        plt.plot(self.x, self.val_losses, label="val_loss")
        plt.legend()
        plt.show(block=False)
        plt.pause(.5)
        plt.close()

plot_losses = PlotLosses()

def graph_loss_against_validation(loss, val):
    plt.plot(loss, color="blue", label="train")
    plt.plot(val, color="orange", label="validation")
    #plt.plot(acc_result, color="red", label="accuracy")
    plt.title("model train vs validation loss")
    plt.ylabel("loss")
    plt.xlabel("epoch")
    plt.legend()
    plt.show()

def graph_accuracy_against_validation(acc, val):
    plt.plot(acc, color="red", label="train")
    plt.plot(val, color="orange", label="validation")
    plt.title("model accuracy vs validation accuracy")
    plt.ylabel("accuracy")
    plt.xlabel("epoch")
    plt.legend()
    plt.show()

def graph_predictions_against_actual(predict, actual):    
    plt.plot(predict, label="predict")
    plt.plot(actual, label="actual")
    plt.legend()
    plt.show()