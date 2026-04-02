def generate_questions(role):
    return [
        f"What is your experience as a {role}?",
        f"Explain a project related to {role}.",
        "What are your strengths?",
        "What challenges have you faced?",
        "Why should we hire you?"
    ]


def evaluate_answer(question, answer):
    score = min(len(answer.split()) // 5, 10)

    feedback = "Good answer" if score > 5 else "Try to explain more clearly"

    return {
        "score": score,
        "feedback": feedback
    }