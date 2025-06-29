# 🧪 Data Alchemist

An AI-powered web application to ingest, validate, and schedule client-task-worker data — with natural language intelligence, rule configuration, and exportable results.

> Built for the Digitalyz Software Engineering Internship assignment.

---

## 🌟 Features

- 📁 **Upload & Parse CSV/XLSX** for clients, tasks, and workers
- ✅ **Real-time Validation** with error summaries
- 🖊️ **Editable Grid UI** to correct data inline
- ⚙️ **Rule Builder**: Create custom co-run and slot rules
- 🔎 **Natural Language Assistant**: Search tasks or generate rules
- 🧠 **AI Rule Suggestions** using pattern analysis
- 🎚️ **Prioritization Panel** to weight scheduling factors
- 📤 **Export Cleaned Data** & `rules.json` for backend use

---

# Added Samples Folder
 - clients.csv
 - workers.csv
 - tasks.csv

# Workflow Video 
[Workflow Video : ](https://youtu.be/o8A3_xxxLbo):

- also added ai features - X factor features for this application.

## 🧠 AI Capabilities

All AI features are powered by [Together.ai](https://together.ai):

- **Natural Language to Rule Conversion**  
  _e.g._: `"Design and QA must run together"` → structured rule JSON

- **AI Rule Recommendations**  
  _e.g._: Suggests slot-restriction or co-run rules from task data

- **Natural Language Task Query**  
  _e.g._: `"Show tasks in phase 2 requiring SkillA"`

> ⚠️ Note: Since Together.ai offers **free-tier access**, **some requests may fail or time out** due to model overload. You can retry or switch to a paid tier for more consistent performance.

---

## 🛠️ Tech Stack

- **Next.js App Router**
- **React + TypeScript**
- **Recoil** for state management
- **TailwindCSS + ShadCN UI** for clean components
- **Together.ai API** for LLM-based AI
- **PapaParse / xlsx** for file parsing

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/OmSharma42306/Data-Alchemist
cd Data-Alchemist

# 2. Install dependencies
pnpm install

# 3. Set up your Together.ai API key
touch .env.local
echo "GPT4_API_KEY=your_together_api_key_here" >> .env.local

# 4. Run the app locally
pnpm dev
