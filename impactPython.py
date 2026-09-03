#-----------------------------------------------------------#
#Name:                                                      #
#Platform: Python                                           #
#Dataset: AI affecting students                             #
#Group: 6                                                   #
#############################################################
#Description: A project to clean and display data, updated  #
#per csv basis. Adjusting tools as needed.                  #
#-----------------------------------------------------------#

import pandas as pd
import plotly.express as px
import matplotlib.pyplot as plt



def load_data(file_path="ai_student_impact_dataset.csv"):
    """Load the student impact dataset."""
    return pd.read_csv(file_path)


def clean_data(df):
    """Report and remove missing and duplicated rows."""

    print("\t=== Missing Values ===")
    print(df.isna().sum())

    missing_rows = df.isna().any(axis=1).sum()
    df = df.dropna()

    print(f"\nRows removed due to missing values: {missing_rows}")

    duplicate_rows = df.duplicated().sum()
    print(f"Duplicated rows: {duplicate_rows}")

    df = df.drop_duplicates()

    print(f"Rows remaining after cleaning: {len(df)}")

    return df


def display_data_info(df):
    """Display the dataset types and columns."""

    print("\n\t=== Data Types ===")
    print(df.dtypes)

    print("\n\t=== Columns in the Dataset ===")
    print(df.columns.tolist())

    print("\n\t=== Dataset Shape ===")
    print(f"Rows: {df.shape[0]}")
    print(f"Columns: {df.shape[1]}")

def calculate_statistics(df):
    """Calculate and display mean, median, minimum, and maximum."""

    numeric_df = df.select_dtypes(include="number")

    print("\n\t=== Statistics ===")

    print("\nMean:")
    print(numeric_df.mean())

    print("\nMedian:")
    print(numeric_df.median())

    print("\nMinimum:")
    print(numeric_df.min())

    print("\nMaximum:")
    print(numeric_df.max())

def plot_major_vs_gpa(df):
    """Bar chart: Major_Category vs Average Post_Semester_GPA."""
    data = df.groupby('Major_Category')['Post_Semester_GPA'].mean().reset_index()
    fig = px.bar(data, x='Major_Category', y='Post_Semester_GPA',
                 title='AI Impact on Students: Major vs GPA',
                 labels={'Major_Category': 'Major', 'Post_Semester_GPA': 'Average GPA'})
    fig.show()
def plot_ai_hours_trend(df):
    """Line chart: Weekly_GenAI_Hours distribution."""
    data = df.groupby('Year_of_Study')['Weekly_GenAI_Hours'].mean().reset_index()
    fig = px.line(data, x='Year_of_Study', y='Weekly_GenAI_Hours',
                  title='Average AI Usage Hours by Year of Study',
                  labels={'Year_of_Study': 'Year of Study', 'Weekly_GenAI_Hours': 'Average Hours'})
    fig.show()

def plot_burnout_risk_distribution(df):
    labels = df['Burnout_Risk_Level'].value_counts().index
    sizes = df['Burnout_Risk_Level'].value_counts().values
    colors = ['red', 'yellow', 'green']  # Custom colors for Low, Medium, High
    fig=px.pie(labels=labels, values=sizes, color_discrete_sequence=colors,
     title='Distribution of Burnout Risk Levels')
    fig.update_traces(marker=dict(line=dict(color="#FFFFFF", width=2)))
    fig.show()
    
def plot_study_hours_spread(df):
    """Box plot: Traditional_Study_Hours."""
    fig = px.box(df, y='Traditional_Study_Hours', 
                 title='Spread of Traditional Study Hours')
    fig.show()

def main():
    """Load, clean, and describe the dataset."""

    df = load_data()
    print(f"Original dataset size: {len(df)} rows")

    df = clean_data(df)
    display_data_info(df)
    calculate_statistics(df)
    plot_major_vs_gpa(df)
    plot_ai_hours_trend(df)
    plot_burnout_risk_distribution(df)
    plot_study_hours_spread(df)

if __name__ == "__main__":
    main()
