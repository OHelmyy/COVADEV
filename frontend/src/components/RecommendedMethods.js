"use client";
import { useState } from "react";

function RecommendedMethods({ data }) {
  const [expanded, setExpanded] = useState({});

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>No recommendations available.</p>;
  }
  

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getComplexityColor = (level) => {
    switch (level?.toLowerCase()) {
      case "easy":
        return "#4ECDC4";
      case "medium":
        return "#FFA500";
      case "hard":
        return "#FF6B6B";
      default:
        return "#C5C6C7";
    }
  };

  return (
    <div className="recommendations-section">
      <h2 className="recommendations-title">Recommended Methods to Develop</h2>

      <div className="recommendations-grid">
        {data.map((rec, index) => (
          <div key={index} className="recommendation-card">
            <div className="recommendation-header">
              <h3 className="recommendation-method">{rec.method}</h3>
              <span
                className="badge complexity-badge"
                style={{
                  borderColor: getComplexityColor(rec.complexity),
                  color: getComplexityColor(rec.complexity),
                }}
              >
                {rec.complexity || "N/A"}
              </span>
            </div>

            <p className="recommendation-description">{rec.description}</p>

            <button
              className="recommendation-action"
              onClick={() => toggleExpand(index)}
            >
              {expanded[index] ? "Hide Steps" : "Implement"}
            </button>

            {expanded[index] && (
              <ul className="implementation-steps">
                {rec.implementationSteps?.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedMethods;
