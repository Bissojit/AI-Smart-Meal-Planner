// grocery_list.jsx
import React from "react";

// Module: GroceryList
const GroceryList = ({ items, title = "Grocery List" }) => {
  if (!items || items.length === 0) return null;

  const cleanItems = items.map((item) =>
    item.replace(/^[•*\-\s]+/, "").trim()
  );

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>{title}</h3>
      <ul>
        {cleanItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryList;
