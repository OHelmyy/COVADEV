"use client";

import { useState, useRef } from "react";
import axios from "axios";

function MainContent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [output, setOutput] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);


  const handleFileSelect = (file) => {
    if (file && (file.name.endsWith(".bpmn") || file.name.endsWith(".java"))) {
      setSelectedFile(file);
      setOutput(
        `File "${file.name}" selected.\n\nSize: ${(file.size / 1024).toFixed(
          2
        )} KB\nType: ${file.type || "Unknown"}\n\nReady to upload...`
      );
      setAiSummary("");
    } else {
      alert("Please select a .bpmn or .java file");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // 🔗 Send file to Spring Boot backend
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      setOutput(`Uploading "${selectedFile.name}" to backend...`);
      setAiSummary("Generating AI summary...");

      const response = await axios.post(
        "http://localhost:8081/api/bpmn/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = response.data;

      if (data && data.processes && Array.isArray(data.processes)) {
        setOutput(`✅ Parsed Processes:\n${data.processes.join("\n")}`);
        setAiSummary(data.description || "No AI summary received.");
      } else {
      // Response from Spring Boot (List<String> or message)
      const result = Array.isArray(response.data)
        ? response.data.join("\n")
        : JSON.stringify(response.data, null, 2);

      

      setOutput(`✅ Upload complete!\n\nParsed Processes:\n${result}`);
      setAiSummary( "No AI summary found.");
      }

    } catch (error) {
      console.error("Error uploading file:", error);
      setOutput(`❌ Upload failed: ${error.message}`);
      setAiSummary("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="content-wrapper">
        <div className="upload-section">
          <h1 className="title">COVADEV File Processor</h1>
          <p className="subtitle">
            Upload your .bpmn or .java files for processing
          </p>

          <div
            className={`upload-area ${isDragging ? "dragging" : ""} ${
              selectedFile ? "has-file" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".bpmn,.java"
              onChange={handleFileChange}
              className="file-input"
            />

            <div className="upload-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>

            {selectedFile ? (
              <div className="file-info">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-size">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div className="upload-text">
                <p className="upload-primary">
                  Click to upload or drag and drop
                </p>
                <p className="upload-secondary">.bpmn or .java files only</p>
              </div>
            )}
          </div>

          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`upload-button ${uploading ? "disabled" : ""}`}
              style={{ marginTop: "15px" }}
            >
              {uploading ? "Uploading..." : "Process File"}
            </button>
          )}
        </div>

        {output && (
          <div className="output-section">
            <h2 className="output-title">Output</h2>
            <div className="output-content">
              <pre className="output-text">{output}</pre>
            </div>
          </div>
        )}
        {aiSummary && (
          <div className="output-section">
            <h2 className="output-title">AI Summary</h2>
            <div className="output-content">
              <pre className="output-text">{aiSummary}</pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default MainContent;
