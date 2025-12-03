from transformers import pipeline

# --------------------------------------------------
# Load T5-Base Summarization Model (loads once)
# --------------------------------------------------
SUMMARIZER = pipeline(
    "summarization",
    model="t5-base",
    tokenizer="t5-base"
)


def generate_process_summary(tasks_data):
    """
    Generates a short paragraph summarizing the process flow
    from a list of task dictionaries.
    """

    # Extract task names
    task_names = [task.get("name") for task in tasks_data if task.get("name")]

    if not task_names:
        return "No process tasks were found to summarize."

    # Format tasks (1. Step A ...)
    numbered_tasks = [f"{i+1}. {name}" for i, name in enumerate(task_names)]
    process_steps_text = "\n".join(numbered_tasks)

    # --------------------------------------------------
    # Prompt designed specifically for a short paragraph
    # --------------------------------------------------
    input_text = (
        "summarize: Provide a clear and concise short paragraph describing "
        "the overall business process based on the following steps:\n"
        f"{process_steps_text}\n"
        "The summary must be one short paragraph only."
    )

    try:
        summary = SUMMARIZER(
            input_text,
            max_length=120,   # Keep it short
            min_length=40,    # Prevent extremely tiny outputs
            do_sample=False
        )[0]["summary_text"]

        return summary.strip()

    except Exception as e:
        print(f"AI summarization failed: {e}")
        return "Error generating summary."
