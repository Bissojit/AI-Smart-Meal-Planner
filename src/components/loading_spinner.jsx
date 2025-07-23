// loading_spinner.jsx
import React from "react";

// Module: LoadingSpinner
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div style={{ marginTop: "1rem", textAlign: "center" }}>
    <p style={{ fontSize: "1.1rem" }}>{message}</p>
  </div>
);

export default LoadingSpinner;
