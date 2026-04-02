from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
import io

from resume_parser import extract_text
from skill_extractor import extract_skills
from job_matcher import calculate_score, skill_gap
from interview_ai import generate_questions, evaluate_answer

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- RESUME ANALYSIS ----------------
@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    
    try:
        # ✅ Convert uploaded file to readable format
        contents = await file.read()
        pdf_file = io.BytesIO(contents)

        # ✅ Extract text
        text = extract_text(pdf_file)

        # ✅ Extract skills
        skills = extract_skills(text)

        print("Extracted Text:", text[:200])
        print("Skills Found:", skills)

        required = ["python", "sql", "machine learning", "react"]

        score = calculate_score(skills, required)
        gap = skill_gap(skills, required)

        return {
            "skills": skills,
            "score": score,
            "missing": gap
        }

    except Exception as e:
        return {"error": str(e)}


# ---------------- INTERVIEW QUESTIONS ----------------
@app.get("/questions")
def get_questions(role: str):
    questions = generate_questions(role)
    return {"questions": questions}


# ---------------- ANSWER EVALUATION ----------------
@app.post("/evaluate")
def evaluate(data: dict):
    result = evaluate_answer(data["question"], data["answer"])
    return {"feedback": result}


# ---------------- OPTIONAL HOME ROUTE ----------------
@app.get("/")
def home():
    return {"message": "API is running 🚀"}