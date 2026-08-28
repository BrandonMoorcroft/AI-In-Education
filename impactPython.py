#-----------------------------------------------------------#
#Name: Brandon Moorcroft                                    #
#Platform: Python                                           #
#Dataset: AI affecting students                             #
#Group: 6                                                   #
#############################################################
#Description: A project to clean and display data, updated  #
#per csv basis. Adjusting tools as needed.                  #
#-----------------------------------------------------------#

import pandas as pd
import seaborn as sns 
import matplotlib
import dash

#Read the CSV
df = pd.read_csv("ai_student_impact_dataset.csv")

#Handle Mistakes in data
####################################################
#Display any empty datas
print(df.isna().sum())


#If there are any null rows drop them
if df.isna.sum() > 0:
    df.drop_na(inplace=True)

#Display the value of the duplicated rows
print(df.duplicated())

#If the duplicated rows exist, drop them
if df.duplicated == True:
    df.drop_duplicated()

#We will check for the types of the data

df.dtypes

#Since there are x columns we will clean those columns and set data as needed