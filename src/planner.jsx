// Import necessary React hooks and components
import React, { useState } from "react";
import { motion } from "framer-motion";
import RecipeResponseBox from "./components/recipe_response_box";
import GroceryList from "./components/grocery_list";
import LoadingSpinner from "./components/loading_spinner";
import { recipes } from "./data/recipes";
import CameraFoodRecognizer from "./components/camera_food_recogniser";

// Main component that takes a task type: "meal" or "ingredients"
const Planner = ({ taskType }) => {
  // State variables for user input, recipe data, UI state, etc.
  const [query, setQuery] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [groceryList, setGroceryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Search recipes by meal name (taskType = "meal")
  const fetchRecipeByMeal = (query) => {
    if (!query.trim()) return;

    // Reset state
    setLoading(true);
    setRecipe(null);
    setGroceryList([]);
    setError(null);
    setSuggestions([]);

    // Simulate loading with timeout
    setTimeout(() => {
      const matches = recipes.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase())
      );

      if (matches.length === 1) {
        // Single match found
        setRecipe(matches[0]);
        setGroceryList(matches[0].ingredients);
      } else if (matches.length > 1) {
        // Multiple suggestions
        setSuggestions(matches);
      } else {
        // No match
        setError("No recipe found for your request.");
      }

      setLoading(false);
    }, 800);
  };

  // Search recipes by list of ingredients (taskType = "ingredients")
  const fetchRecipeByIngredients = (ingredients) => {
    if (!ingredients || ingredients.length === 0) return;

    // Reset state
    setLoading(true);
    setRecipe(null);
    setGroceryList([]);
    setError(null);
    setSuggestions([]);

    // Simulate loading
    setTimeout(() => {
      const matchedRecipes = recipes.filter((r) =>
        ingredients.every((ingredient) =>
          r.ingredients.some((ing) =>
            ing.toLowerCase().includes(ingredient.toLowerCase())
          )
        )
      );

      if (matchedRecipes.length === 1) {
        // One matching recipe
        setRecipe(matchedRecipes[0]);
        setGroceryList(matchedRecipes[0].ingredients);
      } else if (matchedRecipes.length > 1) {
        // Show multiple matches as suggestions
        setSuggestions(matchedRecipes);
      } else {
        // No recipe match
        setError("No recipe found matching those ingredients.");
      }

      setLoading(false);
    }, 800);
  };

  // Handler for camera-based ingredient detection
  const onCameraDetected = (items) => {
    setDetectedIngredients(items);
    fetchRecipeByIngredients(items);
  };

  // Handler when a user selects a suggestion from multiple results
  const handleSuggestionSelect = (selectedTitle) => {
    const selected = suggestions.find((r) => r.title === selectedTitle);
    if (selected) {
      setRecipe(selected);
      setGroceryList(selected.ingredients);
      setSuggestions([]);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      {/* Meal search input section */}
      {taskType === "meal" && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Search for a recipe..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRecipeByMeal(query)}
            disabled={loading}
            style={{
              padding: "0.6rem",
              width: "70%",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
          <motion.button
            onClick={() => fetchRecipeByMeal(query)}
            disabled={!query.trim() || loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              marginLeft: "0.5rem",
              padding: "0.6rem 1.4rem",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              borderRadius: "6px",
              border: "none",
              backgroundColor: loading ? "#888" : "#4CAF50",
              color: "white",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Searching..." : "Search"}
          </motion.button>
        </div>
      )}

      {/* Ingredient input and camera section */}
      {taskType === "ingredients" && (
        <>
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <p>Type ingredients separated by commas or use the camera to detect.</p>
            <input
              type="text"
              placeholder="e.g. tomato, potato, onion"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const typedIngredients = query
                    .split(",")
                    .map((i) => i.trim())
                    .filter(Boolean);
                  fetchRecipeByIngredients(typedIngredients);
                }
              }}
              style={{
                padding: "0.6rem",
                width: "70%",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                marginBottom: "0.5rem",
              }}
            />
            <motion.button
              onClick={() => {
                const typedIngredients = query
                  .split(",")
                  .map((i) => i.trim())
                  .filter(Boolean);
                fetchRecipeByIngredients(typedIngredients);
              }}
              disabled={loading || !query.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                marginLeft: "0.5rem",
                padding: "0.6rem 1.4rem",
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                borderRadius: "6px",
                border: "none",
                backgroundColor: loading ? "#888" : "#4CAF50",
                color: "white",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
                transition: "all 0.3s ease",
              }}
            >
              {loading ? "Searching..." : "Search by Ingredients"}
            </motion.button>
          </div>

          {/* Camera recognizer component */}
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <CameraFoodRecognizer onDetected={onCameraDetected} />
          </div>

          {/* Display list of detected ingredients */}
          {detectedIngredients.length > 0 && (
            <div style={{ marginTop: "1rem", color: "#eee" }}>
              <strong>Detected Ingredients:</strong> {detectedIngredients.join(", ")}
            </div>
          )}
        </>
      )}

      {/* Suggestion buttons when multiple recipes match */}
      {suggestions.length > 1 && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <h3 style={{ color: "#fff" }}>What would you like to make?</h3>
          {suggestions.map((r, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestionSelect(r.title)}
              style={{
                display: "block",
                margin: "0.5rem auto",
                padding: "0.6rem 1.2rem",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#673ab7",
                color: "white",
                cursor: "pointer",
              }}
            >
              {r.title}
            </motion.button>
          ))}
        </div>
      )}

      {/* Conditional UI states: loading spinner, error message, recipe, grocery list */}
      {loading && <LoadingSpinner />}
      {error && (
        <div
          style={{
            color: "red",
            marginTop: "1rem",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      )}
      {!loading && recipe && <RecipeResponseBox recipe={recipe} />}
      {!loading && groceryList.length > 0 && <GroceryList items={groceryList} />}
    </div>
  );
};

// Export the Planner component for use in other parts of the app
export default Planner;
