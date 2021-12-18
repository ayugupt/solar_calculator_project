import tensorflow as tf
import pandas as pd
import numpy as np
import os
import json

def init():
    global model 
    model_path = os.path.join(os.getenv('AZUREML_MODEL_DIR'), 'dnn_model')
    model = tf.keras.models.load_model(model_path)

def run(raw_data):
    day_df = pd.DataFrame(columns=['Day', 'GHIP', 'GHIP2', 'GHIP3'], index=[0])

    day_df.loc[0] = json.loads(raw_data)['data']
    day_df = day_df.apply(pd.to_numeric)

    predictions = {}
    for i in range(365):
        prediction = model.predict(day_df)
        predictions['{}'.format(i)] = str(prediction[0][0])
        day_df['Day'] = (day_df['Day']+1)%366
        day_df['GHIP3'] = day_df['GHIP2']
        day_df['GHIP2'] = day_df['GHIP']
        day_df['GHIP'] = prediction[0][0]

    json_answer = json.dumps(predictions)
    return json_answer