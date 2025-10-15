# COVADEV
BPMN code validation and developer evaluation
🧠 BPM-Code Validator & Developer Evaluator Tool
🔍 Overview

This project aims to bridge the gap between Business Process Models (BPM) and software implementations by providing an automated tool that validates, traces, and evaluates code against BPMN (Business Process Model and Notation) diagrams.
It leverages Large Language Models (LLMs), Aspect-Oriented Programming (AOP), and intelligent analysis to ensure that software faithfully implements business processes — before and after code development.

🚀 Features
1. Automatic Business Process Description

Parses BPMN files to extract individual processes and tasks.

Uses an LLM to automatically generate a natural-language summary of the process.

2. Code Recommendation (Pre-Development Mode)

Suggests which methods or modules developers should implement based on the BPMN model.

Helps ensure that development aligns with the designed business process from the start.

3. Code Validation (Post-Development Mode)

Executes the code and monitors it using Aspect-Oriented Programming (AOP) to capture runtime logs.

Compares logged execution traces with the BPMN model to validate implementation accuracy.

4. Trace Visualization

Displays visual traces of the executed process:

✅ Receive Order → ✅ Approve Payment → ✅ Check Inventory → ✅ Ship Item


Correct steps are marked with ✅

Failed or missing steps are marked with ❌

Time annotations show how long each task took.

5. Round-Trip Validation

Performs Model → Code and Code → Model validation.

Ensures each BPMN task has a corresponding code method.

Detects extra steps in code that aren’t modeled (e.g., “Send Promotional Email”).

6. SLA Monitoring & Performance Evaluation

Measures the execution time of tasks and the overall process.

Compares actual performance against defined Service Level Agreements (SLAs) in the BPMN model.

Evaluates whether time constraints are respected (e.g., “Order-to-shipment ≤ 24 hours”).

7. Developer Evaluation System

Each developer’s code is validated and scored.

The score is accumulated over time in the database for performance tracking.

🧩 Project Workflow

Upload BPMN File → Import and parse the BPM model.

Extract Processes → Identify and store all BPMN tasks.

Generate Description → LLM generates a summary of the process.

Input Code & Developer → Developer submits code for validation.

Execute Code with AOP → Logs and performance data are captured.

Validate Code vs BPMN → Compare execution with BPM tasks.

Display Results & Score Developer → Visualize results and update evaluation scores.

🛠️ Technologies Used
Category	Technologies
Backend	Spring Boot (Java)
Frontend	--------------------------------
Language Models	OpenAI GPT / LLM API
Data Logging	Aspect-Oriented Programming (Spring AOP)
Database	---------------------------------------------
Visualization	---------------------------------------
File Format	BPMN 2.0 XML
🧠 Example Scenario

BPMN Model:
Receive Order → Approve Payment → Check Inventory → Ship Item

Execution Log (AOP):
✅ Receive Order → ✅ Approve Payment → ✅ Check Inventory → ❌ Ship Item

Validation Result:

Missing Ship Item execution → ❌

SLA: 3h total, Actual: 2.5h → ✅

Developer score updated accordingly.

📈 Future Enhancements

🔄 AI-based code recommendations using deeper BPMN understanding

🧩 Multi-developer collaboration scoring

📊 Advanced dashboards for SLA and performance analytics

🌐 BPMN diagram auto-generation from validated code


🧑‍💻 Setup Instructions

Clone the repository

git clone -------------------------


Build the project

mvn clean install


Run the application

mvn spring-boot:run


Access the web app

http://localhost:8080

📜 License



👨‍🏫 Authors

