import React, { useState } from "react";

// Assuming styles and ResultSection component are defined below this class

const BPMNUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false); // For the main file upload
  const [summarizing, setSummarizing] = useState(false); // For the AI call
  const [parsedElements, setParsedElements] = useState(null); // Tasks, Events, etc.
  const [summaryText, setSummaryText] = useState(null); // Only the final summary
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setParsedElements(null);
    setSummaryText(null);
  };

  const processSummarization = async (tasks_data) => {
    setSummarizing(true);
    setSummaryText("Generating summary..."); // Show loading state for summary

    try {
      // 1. Send JUST the extracted task data to a new AI endpoint
      const res = await fetch("http://localhost:8000/api/bpmn/summarize/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the tasks list as JSON in the request body
        body: JSON.stringify({ tasks: tasks_data }), 
      });

      const data = await res.json();

      if (!res.ok) {
        setSummaryText(`Summary Error: ${data.error || "Failed to generate summary."}`);
      } else {
        // 2. Update the dedicated summary state
        setSummaryText(data.summary);
      }
    } catch (err) {
      setSummaryText("Summary API connection failed.");
    }

    setSummarizing(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a BPMN file.");
      return;
    }

    setUploading(true);
    setSummarizing(false);
    setError("");
    setParsedElements(null);
    setSummaryText(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // PHASE 1: Upload file and get parsed elements
      const res = await fetch("http://localhost:8000/api/bpmn/parse/", { // Note: Changed to 'parse/'
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "File parsing failed on the server.");
      } else {
        // 1. Store the core parsed elements and display them immediately
        setParsedElements(data);
        
        // 2. Kick off the AI summarization asynchronously
        if (data.tasks && data.tasks.length > 0) {
            processSummarization(data.tasks);
        } else {
            setSummaryText("No tasks found for summarization.");
        }
      }
    } catch (err) {
      setError("File upload API connection failed.");
    }

    setUploading(false); // Only set uploading to false after phase 1 completes
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>BPMN File Upload</h2>

      {/* File Input */}
      <input
        type="file"
        accept=".bpmn,.xml"
        onChange={handleFileChange}
        style={styles.input}
      />

      {/* Upload Button */}
      <button 
          onClick={handleUpload} 
          style={styles.button} 
          disabled={uploading}
      >
        {uploading ? "Parsing File..." : "Upload & Parse BPMN"}
      </button>

      {/* Error Message */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Parsed Response */}
      {parsedElements && (
        <div style={styles.resultContainer}>
          <h3 style={styles.subtitle}>Process Summary</h3>
          <p style={{ 
              padding: '10px', 
              background: summarizing ? '#4a4a4a' : '#333', 
              borderRadius: '5px',
              fontStyle: summarizing ? 'italic' : 'normal'
          }}>
            {summaryText}
          </p>
          
          <h3 style={styles.subtitle}>Parsed BPMN Elements</h3>

          {/* Use parsedElements to render the lists */}
          <ResultSection title="Tasks" items={parsedElements.tasks} />
          {/* <ResultSection title="Events" items={parsedElements.events} />
          <ResultSection title="Gateways" items={parsedElements.gateways} />
          <ResultSection title="Sequence Flows" items={parsedElements.flows} /> */}
        </div>
      )}
    </div>
  );
};
// ... styles and ResultSection component definition (as previously provided) ...

// Component to render list sections
const ResultSection = ({ title, items }) => (
  <div style={styles.section}>
    <h4>{title}</h4>
    {items.length === 0 ? (
      <p style={{ opacity: 0.6 }}>No {title.toLowerCase()} found.</p>
    ) : (
      <ul>
        {items.map((item, i) => (
          <li key={i} style={styles.listItem}>
            <strong>ID:</strong> {item.id}
            {item.name && (
              <>
                {" "}
                | <strong>Name:</strong> {item.name}
              </>
            )}
            {item.source && (
              <>
                {" "}
                | <strong>Source:</strong> {item.source} →{" "}
                <strong>Target:</strong> {item.target}
              </>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const styles = {
  container: {
    maxWidth: "700px",
    margin: "50px auto",
    padding: "20px",
    background: "#1f1f1f",
    color: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 0px 30px rgba(0,0,0,0.3)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "26px",
    fontWeight: "bold",
  },
  input: {
    marginBottom: "15px",
  },
  button: {
    padding: "10px 18px",
    background: "#4a90e2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  error: {
    color: "#ff4d4d",
    marginTop: "10px",
    textAlign: "center",
  },
  resultContainer: {
    marginTop: "20px",
    padding: "15px",
    background: "#292929",
    borderRadius: "10px",
  },
  subtitle: {
    marginBottom: "10px",
    fontSize: "20px",
    borderBottom: "1px solid #444",
    paddingBottom: "6px",
  },
  section: {
    marginBottom: "15px",
  },
  listItem: {
    marginBottom: "6px",
    background: "#333",
    padding: "8px",
    borderRadius: "5px",
  },
};

export default BPMNUpload;
