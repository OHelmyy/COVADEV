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
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendedMethodsController {

    @Autowired
    private LocalLLMService llmService;

    @PostMapping("/generate")
    public Map<String, String> generateRecommendations(@RequestBody Map<String, String> request) {
        String processText = request.get("text");

        String prompt = "Based on the following BPMN process, identify all possible function or method names that could be implemented "
                +
                "to represent the process steps. For each method, provide:\n" +
                "1. A clear and descriptive method name in camelCase.\n" +
                "2. The expected input parameters (with brief descriptions).\n" +
                "3. The expected output or return value (with brief descriptions).\n\n" +
                "Present the results in a structured and concise format.\n\n" +
                "Here is the process text:\n" +
                processText;

        String recs = llmService.generateSummary(prompt);

        Map<String, String> response = new HashMap<>();
        response.put("recommendations", recs);
        return response;
    }
}
