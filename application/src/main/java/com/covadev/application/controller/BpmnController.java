package com.covadev.application.controller;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.covadev.application.service.BpmnParserService;
import com.covadev.application.service.LocalLLMService; // ✅ import this

@RestController
@RequestMapping("/api/bpmn")
@CrossOrigin(origins = "http://localhost:3000")
public class BpmnController {

    @Autowired
    private BpmnParserService parserService;

    @Autowired
    private LocalLLMService llmService; // ✅ inject it directly

    @PostMapping("/upload")
    public Map<String, Object> uploadBpmnFile(@RequestParam("file") MultipartFile file) throws IOException {
        File tempFile = File.createTempFile("uploaded-", ".bpmn");
        file.transferTo(tempFile);

        // Parse processes
        List<String> processes = parserService.parseProcesses(tempFile);

        // Generate AI summary
        String summaryPrompt = "Summarize the following BPMN process in 2–3 sentences.\n\n"
                + String.join("\n", processes);
        String summary = llmService.generateSummary(summaryPrompt); // ✅ call directly

        // Generate recommendations
        String recPrompt = "Based on the following BPMN processes, suggest 3–5 methods or best practices for improving or implementing them.\n\n"
                + String.join("\n", processes);
        String recommendations = llmService.generateSummary(recPrompt); // ✅ call directly

        tempFile.delete();

        Map<String, Object> response = new HashMap<>();
        response.put("processes", processes);
        response.put("description", summary);
        response.put("recommendations", recommendations);

        return response;
    }
}
