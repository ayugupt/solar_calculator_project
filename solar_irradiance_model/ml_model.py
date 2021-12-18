import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.pylab import rcParams
from sklearn.utils import validation
rcParams['figure.figsize']=20,10
from sklearn.model_selection import train_test_split

import tensorflow as tf


df = pd.read_csv("cleaned_data.csv")
col = df.columns[0]
df.drop(inplace=True, columns=col)
df['GHIP'] = df['GHIP']/1000000
df['GHIP2'] = df['GHIP2']/1000000
df['GHIP3'] = df['GHIP3']/1000000
df['GHI'] = df['GHI']/1000000

x = df[["Day", "GHIP", "GHIP2", "GHIP3"]]
y = df["GHI"]

x_test = x.loc[x.index[-365:]]
y_test = y.loc[y.index[-365:]]
x_test.index = np.arange(len(x_test))
y_test.index = np.arange(len(y_test))

x.drop(inplace=True, index=x.index[-365:])
y.drop(inplace=True, index=y.index[-365:])

x_train, x_validate, y_train, y_validate = train_test_split(x, y, test_size=0.2)

normalizer = tf.keras.layers.Normalization(axis=-1)
normalizer.adapt(np.array(x_train))

model = tf.keras.Sequential([normalizer, tf.keras.layers.Dense(64, activation='relu'), tf.keras.layers.Dense(64, activation='relu'), tf.keras.layers.Dense(units=1)])


model.compile(optimizer=tf.optimizers.Adam(learning_rate=0.1), loss='mean_absolute_error')
history = model.fit(x_train, y_train, epochs=100, validation_split=0.2)

def plot_loss(history):
  plt.plot(history.history['loss'], label='loss')
  plt.plot(history.history['val_loss'], label='val_loss')
  plt.xlabel('Epoch')
  plt.ylabel('Error [MPG]')
  plt.legend()
  plt.grid(True)
  plt.show()


#plot_loss(history)

#model.save('dnn_model')

total_loss = 0
pghi = x_test['GHIP'][0]
p2ghi = x_test['GHIP2'][0]
p3ghi = x_test['GHIP3'][0]
test_df = x_test[:1]

for i in y_test.index:
    prediction = model.predict(test_df)
    p3ghi = p2ghi
    p2ghi = pghi
    pghi = prediction
    total_loss = abs(y_test[i]-prediction)+total_loss
    day = test_df['Day'][0]
    test_df.loc[0, ['GHIP', 'GHIP2', 'GHIP3', 'Day']] = [pghi, p2ghi, p3ghi, (day+1)%365]
    print('Real:{}'.format(y_test[i]))
    print('Prediction:{}'.format(prediction))
    print()

print(total_loss/365)