// recipe_response_box.jsx
import React from "react";

// Module: RecipeResponseBox
const RecipeResponseBox = ({ recipe }) => {
  if (!recipe) return null;

  const steps = recipe.instructions
    .split(/(?<=[.?!])\s+/)
    .filter((line) => line.trim().length > 0);

  return (
    <div
      style={{
        marginTop: "1rem",
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        backgroundColor: "none",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>{recipe.title}</h2>
      <h3 style={{ marginBottom: "0.75rem" }}>Instructions:</h3>
      <div>
        {steps.map((step, index) => (
          <p key={index} style={{ marginBottom: "0.5rem", lineHeight: "1.6" }}>
            <strong>Step {index + 1}:</strong> {step}
          </p>
        ))}
      </div>
    </div>
  );
};

export default RecipeResponseBox;
