import streamlit as st
import requests

BACKEND = "http://127.0.0.1:8000"

st.title("🚀 Smart Resume Analyzer + AI Interview Coach")

# ---------------- RESUME ----------------
uploaded_file = st.file_uploader("Upload Resume (PDF)")

if uploaded_file:
    try:
        res = requests.post(f"{BACKEND}/analyze", files={"file": uploaded_file})

        if res.status_code == 200:
            data = res.json()

            st.subheader("📊 Resume Analysis")

            st.write("Skills Found:")
            for skill in data.get("skills", []):
                st.success(skill)

            st.write("Score:")
            st.progress(int(data.get("score", 0)))

            st.write("Missing Skills:")
            for skill in data.get("missing", []):
                st.error(skill)

        else:
            st.error("Backend error")

    except Exception as e:
        st.error(str(e))


# ---------------- INTERVIEW ----------------
st.subheader("🎤 AI Mock Interview")

role = st.text_input("Enter Job Role")

if st.button("Generate Questions"):
    try:
        res = requests.get(f"{BACKEND}/questions", params={"role": role})

        if res.status_code == 200:
            st.session_state["questions"] = res.json()["questions"]
        else:
            st.error("Error generating questions")

    except Exception as e:
        st.error(str(e))


# ---------------- SHOW QUESTIONS ----------------
if "questions" in st.session_state:
    for q in st.session_state["questions"]:
        st.write("•", q)

    answer = st.text_area("Your Answer")

    if st.button("Evaluate Answer"):
        res = requests.post(
            f"{BACKEND}/evaluate",
            json={
                "question": st.session_state["questions"],
                "answer": answer
            }
        )

        data = res.json()

        st.write("Score:", data["feedback"]["score"])
        st.write("Feedback:", data["feedback"]["feedback"])