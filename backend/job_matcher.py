def calculate_score(found_skills, required_skills):
    if not required_skills:
        return 0

    match = len(set(found_skills) & set(required_skills))
    return round((match / len(required_skills)) * 100, 2)


def skill_gap(found, required):
    return list(set(required) - set(found))