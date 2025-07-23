// app.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/navbar";
import Planner from "./planner";
import TaskSelection from "./components/task_selection";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

console.log("TensorFlow.js version:", tf.version.tfjs);
console.log("MobileNet module loaded:", typeof mobilenet.load === "function");


function App() {
  const [taskType, setTaskType] = useState(null); // null, 'meal', or 'ingredients'

  return (
    <div className="app-container">
      <Navbar />
      <motion.h1
        className="title"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Every Meal in One Place
      </motion.h1>

      {/* Task Selection Screen */}
      {!taskType && <TaskSelection onSelect={setTaskType} />}

      {/* Main App Flow */}
      {taskType && <Planner taskType={taskType} />}
    </div>
  );
}

export default App;
