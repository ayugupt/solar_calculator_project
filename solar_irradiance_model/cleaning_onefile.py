import numpy as np
import pandas as pd
import datetime


df = pd.read_csv("data/2014.csv", skiprows=2)[['Month', 'Day', 'Hour', 'GHI']]
print(df)
newdf = pd.DataFrame(columns=["Day", "GHIP", "GHIP2", "GHIP3"])

day = 0
prevghi = 0
prev2ghi = 0
prev3ghi = 0

for i in range(0, df.shape[0]):
    if i == 0:
        day = 1
        ghi = 3600*df["GHI"][i]
    else:
        if(df["Day"][i-1] != df["Day"][i]):
            newdf.loc[len(newdf.index)] = [day, prevghi, prev2ghi, prev3ghi]

            prev3ghi = prev2ghi
            prev2ghi = prevghi
            prevghi = ghi
            ghi = 0
            day = day+1
        else:
            ghi = ghi+3600*df["GHI"][i]

newdf.loc[len(newdf.index)] = [day, prevghi, prev2ghi, prev3ghi]

prev3ghi = prev2ghi
prev2ghi = prevghi
prevghi = ghi


newdf['GHIP'][0] = prevghi
newdf['GHIP2'][0] = prev2ghi
newdf['GHIP3'][0] = prev3ghi

newdf['GHIP2'][1] = prevghi
newdf['GHIP3'][1] = prev2ghi

newdf['GHIP3'][2] = prevghi


newdf.index = np.arange(newdf.shape[0])
newdf = newdf.apply(pd.to_numeric, errors='coerce')
        
print(newdf)
newdf.to_csv("cleaned_year_data.csv")