import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"; 
import Register from "./pages/register.jsx"; 
import Login from "./pages/login.jsx";
import Account from "./pages/account.jsx";
import Home from "./pages/Home.jsx";
// page après login

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Register />} />
       <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/account" element={<Account/>}/>
    </Routes>
  </BrowserRouter>
);