import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import "./index.css";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu/>}/>
            <Route path="cart" element={<Cart/>}/>
            <Route path="login" element={<Login/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);
