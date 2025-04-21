import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import Unauthorized from "./pages/Unauthorized";
import AdminLayout from "./components/AdminLayout";
import AdmSidebar from "./components/AdmSidebar";
import Users from "./pages/Users";
import Items from "./pages/Items";
import Orders from "./pages/Orders";

import "./index.css";

const ProtectedRoute = ({ allowedRoles }) => {
  const isAuthenticated = () => {
    const token = sessionStorage.getItem('accessToken');
    return !!token;
  };

  const getUserRole = () => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return user.role; 
  };
  
  const auth = isAuthenticated();
  const role = getUserRole();
  
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};

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
            <Route path="unauthorized" element={<Unauthorized />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="admsidebar" element={<AdmSidebar />} />
              <Route path="admindashboard" element={<AdminDashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="items" element={<Items />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["Customer"]} />}>
              <Route path="userprofile" element={<UserProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
