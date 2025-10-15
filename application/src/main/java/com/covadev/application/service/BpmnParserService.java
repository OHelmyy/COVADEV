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

        List<String> processNames = new ArrayList<>();
        for (Process process : processes) {
            String name = process.getName();
            if (name != null && !name.isEmpty()) {
                processRepository.save(new ProcessEntity(null, name));
                processNames.add(name);
            }
        }
        return processNames;
    }
}
