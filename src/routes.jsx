// src/routes.jsx
import { Routes, Route } from "react-router-dom";

// Public Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";

// Admin Layout and Pages
import AdminLayout from "./components/AdminLayout";
import Overview from "./pages/Admin/overview";
import Projects from "./pages/Admin/Projects";
import Coordination from "./pages/Admin/Coordination";
import Timeline from "./pages/Admin/Timeline";
import Communication from "./pages/Admin/Communication";
import Departments from "./pages/Admin/Departments"
import Resources from "./pages/Admin/Resources";
// import Settings from "./pages/Admin/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Admin Nested Routes under /admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Overview />} />
        <Route path="projects" element={<Projects />} />
        <Route path="coordination" element={<Coordination />} />
        <Route path="Resources" element={<Resources />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="communications" element={<Communication />} />
        <Route path="departments" element={<Departments />} />

        {/* <Route path="settings" element={<Settings />} /> */}
      </Route>
    </Routes>
  );
}
