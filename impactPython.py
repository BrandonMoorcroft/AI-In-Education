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
import matplotlib.pyplot as plt
import dash

#Read the CSV
df = pd.read_csv("ai_student_impact_dataset.csv")

#Handle Mistakes in data
####################################################
#Display any empty datas
print(df.isna().sum())

#If there are any null rows drop them

df.dropna(inplace=True)

#Display the value of the duplicated rows
print(df.duplicated())

#If the duplicated rows exist, drop them
if df.duplicated == True:
    df.drop_duplicated()

#We will check for the types of the data

print(df.dtypes)
#Considering the data has no data that is out of type, we will not edit the values

print(df.head())

print(df.describe())
print(df[['Major_Category','Primary_Use_Case','Prompt_Engineering_Skill',
          'Institutional_Policy','Burnout_Risk_Level']].describe())

Avg_retention_score = df['Skill_Retention_Score'].mean()
print(Avg_retention_score) #Checks the average skill retention score.


print(df["Major_Category"].unique())
print(df["Major_Category"].value_counts())

df_test = df[['Major_Category','Traditional_Study_Hours']]
df_grp = df_test.groupby(['Major_Category'], as_index= False).mean()
print (df_grp)

#df_test2 = df[['Major_Category','Year_of_Study',]]

print(df['Paid_Subscription'].unique())
print(df['Paid_Subscription'].value_counts())

df_grp3= pd.crosstab(df['Year_of_Study'], df['Paid_Subscription'])
print (df_grp3)

df_grp4 = pd.crosstab(df['Primary_Use_Case'], df['Paid_Subscription'])
print(df_grp4)

y = df['Anxiety_Level_During_Exams']
x = df['Perceived_AI_Dependency']
plt.scatter(x,y)

plt.title('Anxiety level vs AI Dependency')
plt.xlabel('AI Dependency')
plt.ylabel('Anxiety level')
plt.show()

# GPA change by major
gpa_by_major = df.groupby('Major_Category').apply(
    lambda g: (g['Post_Semester_GPA'] - g['Pre_Semester_GPA']).mean()
).sort_values(ascending=False)
print(gpa_by_major)

# Weekly GenAI hours by year of study
genai_by_year = df.groupby('Year_of_Study', observed=True)['Weekly_GenAI_Hours'].mean()
print(genai_by_year)

#Burnout risk by AI dependency level
burnout_dependency = df.groupby('Burnout_Risk_Level')['Perceived_AI_Dependency'].mean()
print(burnout_dependency)

plt.figure(figsize=(8,5))
plt.bar(gpa_by_major.index, gpa_by_major.values, color='teal')
plt.title('Average Post_Semester_GPA minus Pre_Semester_GPA by Major Category')
plt.xlabel('Major')
plt.ylabel('Avg GPA Change')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.show()

#Pie chart — Distribution of Primary Use Case
use_case_counts = df['Primary_Use_Case'].value_counts()
plt.figure(figsize=(7,7))
plt.pie(use_case_counts.values, labels=use_case_counts.index, autopct='%1.1f%%')
plt.title('Distribution of Primary_Use_Case')
plt.show()

print("Biggest GPA change by major:\n", gpa_by_major)
#Since there are x columns we will clean those columns and set data as needed