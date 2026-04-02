skills_db = [
    "python", "java", "c++", "c", "javascript",
    "machine learning", "ml", "deep learning",
    "sql", "mysql", "postgresql",
    "react", "node", "html", "css",
    "data science", "pandas", "numpy",
    "excel", "power bi"
]

def extract_skills(text):
    text = text.lower()
    found = set()

    for skill in skills_db:
        if skill in text:
            found.add(skill)

    return list(found)