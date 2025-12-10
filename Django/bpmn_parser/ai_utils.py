from transformers import pipeline

PROCESS_DESCRIBER = pipeline(
    "text2text-generation",
    model="google/flan-t5-small"
)

def generate_process_summary(tasks_data):
    # Extract task names
    task_names = [task.get("name") for task in tasks_data if task.get("name")]

    if not task_names:
        return "No process tasks were found to summarize."

    numbered_tasks = [f"{i+1}. {name}" for i, name in enumerate(task_names)]
    process_steps_text = "\n".join(numbered_tasks)

    # ---- Few-shot prompt: show the model an example of what we want ----
    prompt = f"""
You are a business analyst. Your job is to explain business processes in clear natural language.

Example 1
Steps:
1. Receive order from customer
2. Check product availability
3. Pack the order
4. Ship the order

Good summary:
The process starts when a customer places an order. The team then checks whether the requested items are available, prepares the package, and finally ships it to the customer.

Now do the same for the following process.

Important rules:
- Do NOT copy the step sentences.
- Do NOT list the steps.
- Do NOT mention step numbers.
- Combine the ideas and describe the overall flow in your own words.
- Write ONE short paragraph only (3-5 sentences).
- You MUST paraphrase the actions using different wording.
- If a phrase appears in the steps (like 'Confirm Appointment with Patient'),
  rewrite it using different words (e.g., 'inform the patient that the booking is confirmed').


Steps:
{process_steps_text}

Summary:
""".strip()

    try:
        result = PROCESS_DESCRIBER(
            prompt,
            max_new_tokens=90,
            do_sample=True,      # add some creativity
            top_p=0.9,
            temperature=0.9
        )
        summary = result[0]["generated_text"].strip()
        return summary

    except Exception as e:
        print(f"AI generation failed: {e}")
        return "Error generating summary."
