package com.covadev.application.controller;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.covadev.application.service.BpmnParserService;

@RestController
@RequestMapping("/api/bpmn")
@CrossOrigin(origins = "http://localhost:3000") // allow React during dev
public class BpmnController {

    @Autowired
    private BpmnParserService parserService;

    @PostMapping("/upload")
    public Map<String, Object> uploadBpmnFile(@RequestParam("file") MultipartFile file) throws IOException {
        File tempFile = File.createTempFile("uploaded-", ".bpmn");
        file.transferTo(tempFile);

        Map<String, Object> response = parserService.parseProcessesWithSummary(tempFile);

        tempFile.delete();
        return response;
    }
}
