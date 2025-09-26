import pandas as pd
import json

# 🔹 Input CSV file (from Kaggle dataset)
csv_file = "jobs.csv"    # change this to your dataset path

# 🔹 Output JSON file
json_file = "data/raw_records.json"

# 1. Load CSV
df = pd.read_csv(csv_file)

# 2. Keep only the fields we need + rename them
# Make sure column names match your dataset exactly
records = df.rename(columns={
    "Job Title": "title",
    "Skills": "skills",
    "Industry": "industry",
    "Job Posting Date": "posted_date",
    "Company Name": "company",
    "Location": "location"
})[["title", "skills", "industry", "posted_date", "company", "location"]]

# 3. Convert to list of dicts
records_list = records.to_dict(orient="records")

# 4. Save to JSON
with open(json_file, "w", encoding="utf-8") as f:
    json.dump(records_list, f, indent=2, ensure_ascii=False)

print(f"✅ Saved {len(records_list)} records to {json_file}")
