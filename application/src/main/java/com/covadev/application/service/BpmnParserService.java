package com.covadev.application.service;

import com.covadev.application.model.ProcessEntity;
import com.covadev.application.repository.ProcessRepository;
import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.Process;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class BpmnParserService {

    @Autowired
    private ProcessRepository processRepository;

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
}
