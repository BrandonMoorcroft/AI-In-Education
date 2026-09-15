# Campus Lift — NPower Group 6

Interactive dashboard for the **Impact of Generative AI on University Students** study (50,000-student sample). Filter by major, year, and use case. Compare two groups.

No login. No database. The numbers are already rolled up in `src/data/campus-lift.json`.

## Run it

You need [Node.js 22](https://nodejs.org/).

```bash
git clone https://github.com/codebyallenlazarus-ui/npower-group6-campus-lift.git
cd npower-group6-campus-lift
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`). Open that in a browser.

```bash
npm run build
npm run preview
```

That is the production build.

## What you are looking at

- **GPA lift** = post-semester GPA minus pre-semester GPA
- **Hours** = weekly GenAI use
- **Compare groups** = Group A vs Group B on the same GPA chart (A pre / B pre / A post / B post)

Charts that are not part of the comparison (skill, burnout, year, major heatmap) fade out in compare mode.

## Repo layout

```
src/App.tsx                      dashboard
src/components/dashboard/        charts, filters, KPIs
src/data/campus-lift.json        pre-aggregated 50k-student cube
src/lib/cube.ts                  filters + rollups
```

The original CSV is not required to run the app. Keep it with the Colab notebook if you want to rebuild the cube later.

## Private repo

This repository is private. Invite Group 6 under **Settings → Collaborators**.

A private GitHub repo is source control only. For a live URL, connect the repo to Vercel (or similar) and keep the Vercel project private, or keep using the Grok preview.
