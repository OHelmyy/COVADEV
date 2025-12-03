package com.covadev.application.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;

@Service
public class LocalLLMService {

    private static final String OLLAMA_URL = "http://localhost:11434/api/generate";

    public String generateSummary(String prompt) {
        try {
            System.out.println("Sending LLM prompt...");

            URL url = new URL(OLLAMA_URL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            // Proper JSON escaping and formatting
            String safePrompt = prompt.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n");

            String jsonBody = String.format(
                    "{\"model\":\"llama3\",\"prompt\":\"%s\",\"stream\":false}",
                    safePrompt);

            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonBody.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int status = connection.getResponseCode();
            if (status != HttpURLConnection.HTTP_OK) {
                return " Error calling LLM: Server returned HTTP " + status;
            }

            StringBuilder response = new StringBuilder();
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
            }

            // Extract the actual text response
            String raw = response.toString();
            String cleaned = raw.replaceAll(".*\"response\"\\s*:\\s*\"", "")
                    .replaceAll("\"\\s*,\\s*\"done\".*", "")
                    .replace("\\n", "\n")
                    .trim();

            cleaned = cleaned.replaceFirst("^.*\\r?\\n", "").trim();

            return cleaned.isEmpty() ? " No summary generated." : cleaned;

        } catch (Exception e) {
            return "Error calling LLM: " + e.getMessage();
        }
    }

}
