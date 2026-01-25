import React from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

export default function App() {
  return (
    <div>
      <h1>Blog Platform</h1>
      <Register />
      {/* Tu pourras switcher vers Login ou Home plus tard */}
    </div>
  );
}
