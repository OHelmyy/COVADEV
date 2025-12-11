from transformers import pipeline

# --------------------------------------------------
# 1. Load FLAN-T5 Small
# --------------------------------------------------
PROCESS_DESCRIBER = pipeline(
    "text2text-generation",
    model="google/flan-t5-small"
)


# --------------------------------------------------
# 2. Helper: expand a short task label into a sentence
#    (you can add more rules here later)
# --------------------------------------------------
def expand_task_name(name: str) -> str:
    """
    Turn a short BPMN task label into a simple sentence.
    Customize this with more patterns for your domain.
    """
    n = name.lower().strip()

    if "confirm" in n and "appointment" in n:
        return "The clinic confirms the appointment details with the patient."
    if "patient receives" in n and "confirmation" in n:
        return "The patient receives a confirmation message with the appointment details."
    if "conduct" in n and "consultation" in n:
        return "The doctor conducts the medical consultation with the patient at the scheduled time."
    if "choose another time" in n:
        return "If the suggested time is not suitable, the patient chooses a different appointment time."
    if "submit" in n and "request" in n:
        return "The patient submits a request to book an appointment."
    if "check" in n and "schedule" in n:
        return "The system checks the doctor's schedule to find available time slots."
    if "choose" in n and "appointment" in n:
        return "The patient selects a suitable appointment time from the available options."
    if "process" in n and "payment" in n:
        return "The system processes the payment for the appointment."

    # Generic fallback
    return f"In this step, the system or user performs the action: {name}."


# --------------------------------------------------
# 3. Main function: generate process summary
# --------------------------------------------------
def generate_process_summary(tasks_data):
    """
    tasks_data: list of dicts like:
        [{"name": "Confirm Appointment with Patient"}, ...]
    Returns: one natural-language paragraph explaining the whole process.
    """

    # Extract task names
    task_names = [task.get("name") for task in tasks_data if task.get("name")]

    if not task_names:
        return "No process tasks were found to summarize."

    # Step 1: expand each short label into a full sentence
    expanded_sentences = [expand_task_name(name) for name in task_names]
    detailed_paragraph = " ".join(expanded_sentences)

    # Step 2: ask FLAN-T5 to explain that paragraph in its own words
    prompt = (
        "You are a business analyst. The following paragraph describes the detailed "
        "steps of a business process. Write ONE short paragraph (3–5 sentences) that "
        "explains the overall process from start to finish in natural language for a "
        "non-technical person. Do NOT list the steps or repeat the sentences exactly; "
        "paraphrase and combine them into a coherent story.\n\n"
        f"{detailed_paragraph}\n\n"
        "Process explanation:"
    )

    try:
        result = PROCESS_DESCRIBER(
            prompt,
            max_new_tokens=150,
            do_sample=False,   # deterministic, less chance of weird copying
            num_beams=4,
        )
        summary = result[0]["generated_text"].strip()
        return summary

    except Exception as e:
        print(f"AI generation failed: {e}")
        return "Error generating summary."


# # --------------------------------------------------
# # 4. Optional quick test
# # --------------------------------------------------
# if __name__ == "__main__":
#     example_tasks = [
#         {"name": "Confirm Appointment with Patient"},
#         {"name": "Patient Receives Confirmation"},
#         {"name": "Conduct Consultation"},
#         {"name": "Choose another time"},
#         {"name": "Submit Request Appointment"},
#         {"name": "Check Doctor's Schedule"},
#         {"name": "Choose Appointment Time"},
#         {"name": "Process Payment"},
#     ]

#     print(generate_process_summary(example_tasks))
