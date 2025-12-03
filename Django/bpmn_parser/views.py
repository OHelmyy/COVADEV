import json
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# Import your custom parsing logic
from .parser import parse_bpmn_from_content 

from .ai_utils import generate_process_summary 

@method_decorator(csrf_exempt, name="dispatch")
class ParseOnlyBPMNView(View):
    """Handles file upload, parses XML, and returns structured data."""

    def post(self, request):
        if "file" not in request.FILES:
            return JsonResponse({"error": "No BPMN file uploaded."}, status=400)

        file = request.FILES["file"]

        try:
            # Read and parse the file content
            xml_content = file.read().decode('utf-8')
            parsed_data = parse_bpmn_from_content(xml_content) 
            
            # The UI issue where tasks were missing was likely because the 
            # previous view returned data without the 'tasks' key directly at the top level.
            # This implementation ensures all parsed lists are returned.
            return JsonResponse({
                "name": file.name,
                "tasks": parsed_data["tasks"],
                "events": parsed_data["events"],
                "gateways": parsed_data["gateways"],
                "flows": parsed_data["flows"]
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": f"Failed to parse BPMN file: {str(e)}"}, status=500)




@method_decorator(csrf_exempt, name="dispatch")
class SummarizeTasksView(View):
    """Receives JSON of tasks and returns the AI-generated summary."""

    def post(self, request):
        try:
            # Read the JSON body from the request
            data = json.loads(request.body)
            tasks_list = data.get('tasks', [])
            
            if not tasks_list:
                return JsonResponse({"error": "No tasks provided for summarization."}, status=400)

            # Generate the summary
            summary_text = generate_process_summary(tasks_list)
            
            return JsonResponse({
                "summary": summary_text
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            # Catch errors during summarization
            return JsonResponse({"error": f"AI processing failed: {str(e)}"}, status=500)