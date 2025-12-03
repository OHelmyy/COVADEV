from django.urls import path
from .views import ParseOnlyBPMNView, SummarizeTasksView # Note the new imports

urlpatterns = [
    # 1. The React component's PHASE 1 endpoint
    path('parse/', ParseOnlyBPMNView.as_view(), name='bpmn_parse'), 
    
    # 2. The React component's PHASE 2 AI endpoint
    path('summarize/', SummarizeTasksView.as_view(), name='bpmn_summarize'),
]