package com.covadev.application.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.covadev.application.service.LocalLLMService;

@RestController
@RequestMapping("/api/description")
@CrossOrigin(origins = "http://localhost:3000")
public class ProcessDescriptionController {

    @Autowired
    private LocalLLMService llmService;

    @PostMapping("/generate")
    public Map<String, String> generateDescription(@RequestBody Map<String, String> request) {
        String processText = request.get("text");

        String prompt = "Summarize the following BPMN process in 2 to 3 sentences. "
                + "Explain what it does and its main goal in simple business terms.\n\n"
                + processText;

        String summary = llmService.generateSummary(prompt);

        Map<String, String> response = new HashMap<>();
        response.put("description", summary);
        return response;
    }
}
