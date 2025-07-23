import React, { useRef, useEffect, useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";

const CameraFoodRecognizer = ({ onDetected }) => {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]); // raw predictions
  const [items, setItems] = useState([]); // split individual items with probability
  const [selections, setSelections] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    mobilenet
      .load()
      .then((loadedModel) => {
        setModel(loadedModel);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Model load error:", err);
        setError("Failed to load model.");
        setLoading(false);
      });

    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error("Camera access error:", err);
          setError("Camera access denied or not available.");
        });
    }
  }, []);

  const classifyFrame = async () => {
    if (!model || !videoRef.current) return;

    try {
      const results = await model.classify(videoRef.current);
      setPredictions(results);
      setSelections({}); // reset selections on new detection

      // Split classNames by comma, create array of { name, probability }
      const splitItems = results.flatMap(({ className, probability }) => {
        const parts = className.split(",").map((part) => part.trim());
        return parts.map((part, index) => ({
          name: part,
          probability: index === 0 ? probability : null, // only show prob once
        }));
      });
      setItems(splitItems);
    } catch (err) {
      console.error("Classification error:", err);
      setError("Error during prediction.");
    }
  };

  const toggleSelection = (item) => {
    setSelections((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const confirmSelection = () => {
    const selectedItems = Object.keys(selections).filter((key) => selections[key]);
    if (selectedItems.length > 0 && onDetected) {
      onDetected(selectedItems);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      {loading && <p>Loading AI model...</p>}
      {!loading && model && (
        <p style={{ color: "lightgreen", fontWeight: "bold" }}>
          AI Model Loaded Successfully
        </p>
      )}
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}

      <video
        ref={videoRef}
        width="300"
        height="225"
        muted
        playsInline
        style={{
          borderRadius: 8,
          border: "2px solid #ccc",
          marginTop: "1rem",
        }}
      />
      <br />
      <button
        onClick={classifyFrame}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: "0.6rem 1.4rem",
          fontSize: "1rem",
          borderRadius: "6px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        Detect Food
      </button>

      {items.length > 0 && (
        <div
          style={{
            marginTop: "1.5rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: "1rem",
            borderRadius: "10px",
            color: "#fff",
            fontWeight: "bold",
            maxWidth: "400px",
            margin: "1.5rem auto",
            textAlign: "left",
          }}
        >
          <h3>Detected Items (Separated):</h3>
          <ol>
            {items.map(({ name, probability }, i) => (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={!!selections[name]}
                    onChange={() => toggleSelection(name)}
                  />{" "}
                  {name} {probability !== null && `— ${(probability * 100).toFixed(2)}%`}
                </label>
              </li>
            ))}
          </ol>

          <button
            onClick={confirmSelection}
            disabled={Object.values(selections).filter(Boolean).length === 0}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.4rem",
              fontSize: "1rem",
              borderRadius: "6px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "block",
              width: "100%",
            }}
          >
            Confirm Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraFoodRecognizer;
