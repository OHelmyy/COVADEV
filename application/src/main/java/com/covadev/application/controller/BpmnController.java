package com.covadev.application.controller;


import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.covadev.application.service.BpmnParserService;

@RestController
@RequestMapping("/api/bpmn")
public class BpmnController {

    @Autowired
    private BpmnParserService parserService;

    @PostMapping("/upload")
    public List<String> uploadBpmnFile(@RequestParam("file") MultipartFile file) throws IOException {
        File tempFile = File.createTempFile("uploaded-", ".bpmn");
        file.transferTo(tempFile);

        List<String> processNames = parserService.parseProcesses(tempFile);
        tempFile.delete();

        return processNames;
    }
}

