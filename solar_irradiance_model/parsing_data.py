import pandas as pd
import numpy as np

finalDF = pd.DataFrame()

for y in range(2000, 2015):
    df = pd.read_csv("data/{}.csv".format(y))
    df = df[['Source', 'Location ID', 'City', "State", "Country", "Latitude", "Longitude", "Time Zone"]]

    columns = df.columns
    for col in columns:
        df[str(df[col][1])] = [None]*2 + [df[col][i] for i in range (2, df[col].shape[0])]
        df.drop(col, inplace=True, axis=1)

    df.drop(inplace=True, index=[0, 1])
    finalDF = finalDF.append(df)

finalDF.index = np.arange(finalDF.shape[0])
finalDF.to_csv("parsed_data.csv")
