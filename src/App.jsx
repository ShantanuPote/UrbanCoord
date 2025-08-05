// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes"; // Make sure you have a valid routes.jsx or routes/index.jsx file

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
