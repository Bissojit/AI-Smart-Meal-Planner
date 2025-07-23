// components/task_selection.jsx
import React from "react";

// Module: TaskSelection
const TaskSelection = ({ onSelect }) => {
  return (
    <div className="task-selection">
      <h2>What would you like to do?</h2>
      <button onClick={() => onSelect("meal")}>Search by Meal Name</button>
      <button onClick={() => onSelect("ingredients")}>Build from Ingredients</button>
    </div>
  );
};

export default TaskSelection;
