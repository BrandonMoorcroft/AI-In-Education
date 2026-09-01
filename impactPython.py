#-----------------------------------------------------------#
#Platform: Python                                           #
#Dataset: AI affecting students                             #
#Group: 6                                                   #
#############################################################
#Description: A project to clean and display data, updated  #
#per csv basis. Adjusting tools as needed.                  #
#-----------------------------------------------------------#

import pandas as pd
import seaborn as sns 
import matplotlib as plt
import dash

#Read the CSV
df = pd.read_csv("ai_student_impact_dataset.csv")

#Handle Mistakes in data
####################################################

#Display any empty datas
print("Empty values per column:")
print(df.isna().sum())

#If there are any null rows drop them

df = df.dropna()

#Display the value of the duplicated rows
print("Duplicated rows:")
print(df.duplicated().sum())

#If the duplicated rows exist, drop them
if df.duplicated == True:
    df = df.drop_duplicated()

#We will check for the types of the data

print(df.dtypes)
#Considering the data has no data that is out of type, we will not edit the values



#Since there are x columns we will clean those columns and set data as needed


#Data Analysis
###################################################################################

#Basic block for mean/median/max/min which can be used for any column
mean1 = df['Weekly_GenAI_Hours'].mean()
median1 = df['Weekly_GenAI_Hours'].median()
min1 = df['Weekly_GenAI_Hours'].min()
max1 = df['Weekly_GenAI_Hours'].max()
#In particular the above is Weekly hours spent using GenAi




#Display groups for analysis such as burnout by year
burnoutRiskByYear = df.groupby('Burnout_Risk_Level')['Anxiety_Level_During_Exams']

print(burnoutRiskByYear)



#Create visualizations of the data using the groups chosen for analysis
sns.barplot(data=df, x='Burnout_Risk_Level', y='Anxiety_Level_During_Exams')
plt.show() 



#Interactive Dashboard
###################################################################################

#must have a filter for a categorical check
#4 visualizations, preferrably the ones we made earlier
