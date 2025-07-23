// navbar.jsx
import React from "react";
import { motion } from "framer-motion";

// Module: Navbar
const Navbar = () => {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="logo">Smart Meal Planner</div>
    </motion.nav>
  );
};

export default Navbar;
