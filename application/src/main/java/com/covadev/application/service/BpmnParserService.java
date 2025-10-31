package com.covadev.application.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.Process;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.covadev.application.model.ProcessEntity;
import com.covadev.application.repository.ProcessRepository;

@Service
public class BpmnParserService {

    @Autowired
    private ProcessRepository processRepository;

    @Autowired
    private LocalLLMService llmService;

    public List<String> parseProcesses(File file) {
        BpmnModelInstance modelInstance = Bpmn.readModelFromFile(file);
        Collection<Process> processes = modelInstance.getModelElementsByType(Process.class);

        List<String> processDetails = new ArrayList<>();

        for (Process process : processes) {
            StringBuilder sb = new StringBuilder();
            String processName = process.getName() != null ? process.getName() : process.getId();
            sb.append("Process: ").append(processName);

            // Save process in DB
            processRepository.save(new ProcessEntity(null, processName));

            // Get all flow elements (tasks, events, etc.)
            Collection<org.camunda.bpm.model.bpmn.instance.FlowElement> elements = process.getFlowElements();

            for (org.camunda.bpm.model.bpmn.instance.FlowElement element : elements) {
                // Skip sequenceFlow elements
                if (element instanceof org.camunda.bpm.model.bpmn.instance.SequenceFlow) {
                    continue;
                }

                String elementType = element.getElementType().getTypeName();
                String elementName = element.getName() != null ? element.getName() : element.getId();

                sb.append("\n  - ").append(elementType).append(": ").append(elementName);
            }

            processDetails.add(sb.toString());
        }

        return processDetails;
    }

public Map<String, Object> parseProcessesWithSummary(File file) {
        List<String> processes = parseProcesses(file);
        String allProcessesText = String.join("\n", processes);

        String prompt = "Summarize the following BPMN process in 2 to 3 sentences. "
        + "Explain what the process does, its main goal, and the general flow. "
        + "Keep it short and clear for a business reader.\n\n"
        + "BPMN Process:\n"
        + allProcessesText;

    // Call AI summary builder from LocalLLMService
        String summary = llmService.generateSummary(prompt);

        Map<String, Object> result = new HashMap<>();
        result.put("processes", processes);
        result.put("description", summary);
        return result;
    }

    public Map<String, Object> parseProcessesWithRecommendations(File file) {
    List<String> processes = parseProcesses(file);
    String allProcessesText = String.join("\n", processes);

    // Prompt to guide the AI to generate method recommendations
    String prompt = "You are a BPMN process analysis assistant. Based on the following BPMN processes, "
        + "generate a list of 3–5 recommended methods, actions, or improvements for implementing or optimizing this workflow. "
        + "Each recommendation should be concise (1–2 sentences) and actionable for a software developer or process analyst.\n\n"
        + "BPMN Processes:\n"
        + allProcessesText;

    // Use your Local LLM to get recommendations
    String recommendationsText = llmService.generateSummary(prompt);

    Map<String, Object> result = new HashMap<>();
    result.put("processes", processes);
    result.put("recommendations", recommendationsText);
    return result;
}


}

