import pandas as pd
import numpy as np

df = pd.read_csv('parsed_data.csv')
df.drop(columns=df.columns[0], inplace=True, axis=1)
newdf = pd.DataFrame(columns=["Day", "GHI", "GHIP", "GHIP2", "GHIP3"])

day = 0
ghi = 0
prevghi = 0
prev2ghi = 0
prev3ghi = 0

for i in range(0, df.shape[0]):
    if i == 0:
        day = 1
        ghi = 3600*df["GHI"][i]
    else:
        if(df["Day"][i-1] != df["Day"][i]):
            newdf.loc[len(newdf.index)] = [day, ghi, prevghi, prev2ghi, prev3ghi]

            prev3ghi = prev2ghi
            prev2ghi = prevghi
            prevghi = ghi
            ghi = 0

            if(df["Year"][i-1] != df["Year"][i]):
                day = 1
            else:
                day = day+1
        else:
            ghi = ghi+3600*df["GHI"][i]

newdf.drop(inplace=True, index=[0, 1, 2])
newdf.index = np.arange(newdf.shape[0])
newdf = newdf.apply(pd.to_numeric, errors='coerce')
        

newdf.to_csv("cleaned_data.csv")
