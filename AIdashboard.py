from dash import Dash, dcc, html, Input, Output
import pandas as pd
import plotly.express as px
import matplotlib.pyplot as plt


def create_app(df):

 app = Dash(__name__)

 app.title = "AI Student Impact Dashboard"


 app.layout = html.Div(
    style={
        "fontFamily": "Arial",
        "backgroundColor": "#f4f6f8",
        "padding": "20px"
    },
    children=[

        html.H1(
            "AI Student Impact Dashboard",
            style={
                "textAlign": "center",
                "color": "#2c3e50"
            }
        ),

        html.P(
            "Interactive analysis of Generative AI usage and student outcomes",
            style={
                "textAlign": "center",
                "color": "#555"
            }
        ),

      
        html.Div(
            style={
                "display": "flex",
                "gap": "20px",
                "marginBottom": "25px"
            },
            children=[

                html.Div(
                    style={"flex": "1"},
                    children=[
                        html.Label("Major Category"),
                        dcc.Dropdown(
                            id="major-filter",
                            options=[
                                {
                                    "label": major,
                                    "value": major
                                }
                                for major in sorted(
                                    df["Major_Category"].dropna().unique()
                                )
                            ],
                            value=None,
                            placeholder="All Major Categories",
                            clearable=True
                        )
                    ]
                ),

                html.Div(
                    style={"flex": "1"},
                    children=[
                        html.Label("Year of Study"),
                        dcc.Dropdown(
                            id="year-filter",
                            options=[
                                {
                                    "label": str(year),
                                    "value": year
                                }
                                for year in sorted(
                                    df["Year_of_Study"].dropna().unique()
                                )
                            ],
                            value=None,
                            placeholder="All Years",
                            clearable=True
                        )
                    ]
                )
            ]
        ),

        # -----------------------------
        # KPI Cards
        # -----------------------------

        html.Div(
            style={
                "display": "flex",
                "gap": "20px",
                "marginBottom": "25px"
            },
            children=[

                html.Div(
                    id="students-card",
                    style={
                        "flex": "1",
                        "backgroundColor": "white",
                        "padding": "20px",
                        "borderRadius": "10px",
                        "textAlign": "center",
                        "boxShadow": "0 2px 5px rgba(0,0,0,0.1)"
                    }
                ),

                html.Div(
                    id="gpa-card",
                    style={
                        "flex": "1",
                        "backgroundColor": "white",
                        "padding": "20px",
                        "borderRadius": "10px",
                        "textAlign": "center",
                        "boxShadow": "0 2px 5px rgba(0,0,0,0.1)"
                    }
                ),

                html.Div(
                    id="ai-hours-card",
                    style={
                        "flex": "1",
                        "backgroundColor": "white",
                        "padding": "20px",
                        "borderRadius": "10px",
                        "textAlign": "center",
                        "boxShadow": "0 2px 5px rgba(0,0,0,0.1)"
                    }
                ),

                html.Div(
                    id="skill-card",
                    style={
                        "flex": "1",
                        "backgroundColor": "white",
                        "padding": "20px",
                        "borderRadius": "10px",
                        "textAlign": "center",
                        "boxShadow": "0 2px 5px rgba(0,0,0,0.1)"
                    }
                )
            ]
        ),

        # -----------------------------
        # Charts
        # -----------------------------

        html.Div(
            style={
                "display": "grid",
                "gridTemplateColumns": "1fr 1fr",
                "gap": "20px"
            },
            children=[

                html.Div(
                    style={
                        "backgroundColor": "white",
                        "padding": "10px",
                        "borderRadius": "10px"
                    },
                    children=[
                        dcc.Graph(id="bar-chart")
                    ]
                ),

                html.Div(
                    style={
                        "backgroundColor": "white",
                        "padding": "10px",
                        "borderRadius": "10px"
                    },
                    children=[
                        dcc.Graph(id="line-chart")
                    ]
                ),

                html.Div(
                    style={
                        "backgroundColor": "white",
                        "padding": "10px",
                        "borderRadius": "10px"
                    },
                    children=[
                        dcc.Graph(id="pie-chart")
                    ]
                ),

                html.Div(
                    style={
                        "backgroundColor": "white",
                        "padding": "10px",
                        "borderRadius": "10px"
                    },
                    children=[
                        dcc.Graph(id="box-chart")
                    ]
                )
            ]
        )
    ]
 )


# --------------------------------------------------
# Callback
# --------------------------------------------------

 @app.callback(
    [
        Output("students-card", "children"),
        Output("gpa-card", "children"),
        Output("ai-hours-card", "children"),
        Output("skill-card", "children"),
        Output("bar-chart", "figure"),
        Output("line-chart", "figure"),
        Output("pie-chart", "figure"),
        Output("box-chart", "figure")
    ],
    [
        Input("major-filter", "value"),
        Input("year-filter", "value")
    ]
 )
 def update_dashboard(selected_major, selected_year):

    filtered_df = df.copy()

    if selected_major is not None:
        filtered_df = filtered_df[
            filtered_df["Major_Category"] == selected_major
        ]

    if selected_year is not None:
        filtered_df = filtered_df[
            filtered_df["Year_of_Study"] == selected_year
        ]

  
    student_count = len(filtered_df)

    avg_gpa = filtered_df["Post_Semester_GPA"].mean()

    avg_ai_hours = filtered_df["Weekly_GenAI_Hours"].mean()

    avg_skill = filtered_df["Skill_Retention_Score"].mean()

    # --------------------------------------------------
    # Bar Chart
    # Major Category vs Average GPA
    # --------------------------------------------------

    bar_data = (
        filtered_df
        .groupby("Major_Category", as_index=False)
        ["Post_Semester_GPA"]
        .mean()
    )

    bar_fig = px.bar(
        bar_data,
        x="Major_Category",
        y="Post_Semester_GPA",
        title="Average Post-Semester GPA by Major Category",
        labels={
            "Major_Category": "Major Category",
            "Post_Semester_GPA": "Average GPA"
        },
        color="Post_Semester_GPA",
        color_continuous_scale="Blues"
    )

    # --------------------------------------------------
    # Line Chart
    # GPA by Year of Study
    # --------------------------------------------------

    line_data = (
        filtered_df
        .groupby("Year_of_Study", as_index=False)
        ["Post_Semester_GPA"]
        .mean()
        .sort_values("Year_of_Study")
    )

    line_fig = px.line(
        line_data,
        x="Year_of_Study",
        y="Post_Semester_GPA",
        title="Average GPA by Year of Study",
        markers=True,
        labels={
            "Year_of_Study": "Year of Study",
            "Post_Semester_GPA": "Average GPA"
        }
    )

    # --------------------------------------------------
    # Pie Chart
    # Primary AI Use Case
    # --------------------------------------------------

    pie_data = (
        filtered_df["Primary_Use_Case"]
        .value_counts()
        .reset_index()
    )

    pie_data.columns = ["Primary_Use_Case", "Count"]

    pie_fig = px.pie(
        pie_data,
        names="Primary_Use_Case",
        values="Count",
        title="Distribution of Primary GenAI Use Cases",
        hole=0.3
    )

    # --------------------------------------------------
    # Box Plot
    # GPA Distribution
    # --------------------------------------------------

    box_fig = px.box(
        filtered_df,
        y="Post_Semester_GPA",
        x="Major_Category",
        points="outliers",
        title="Distribution of Post-Semester GPA",
        labels={
            "Major_Category": "Major Category",
            "Post_Semester_GPA": "Post-Semester GPA"
        }
    )

    students_card = [
        html.H3("Total Students"),
        html.H2(f"{student_count}")
    ]

    gpa_card = [
        html.H3("Average Post-Semester GPA"),
        html.H2(
            f"{avg_gpa:.2f}" if pd.notna(avg_gpa) else "N/A"
        )
    ]

    ai_hours_card = [
        html.H3("Average Weekly GenAI Hours"),
        html.H2(
            f"{avg_ai_hours:.2f}" if pd.notna(avg_ai_hours) else "N/A"
        )
    ]

    skill_card = [
        html.H3("Average Skill Retention"),
        html.H2(
            f"{avg_skill:.2f}" if pd.notna(avg_skill) else "N/A"
        )
    ]

    return (
        students_card,
        gpa_card,
        ai_hours_card,
        skill_card,
        bar_fig,
        line_fig,
        pie_fig,
        box_fig
    )
 return app
