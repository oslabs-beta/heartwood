import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Functions from "../components/Functions";
import Logs from "../components/Logs";
import Settings from "../components/Settings";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

const SideNav = () => {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar content */}
        <div className="w-64 bg-base-200 text-base-content h-screen p-4">
          <ul className="menu">
            {/* Sidebar navigation links */}
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/functions">Functions</Link>
            </li>
            <li>
              <Link to="/logs">Logs</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </div>

        {/* Page content */}
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="functions" element={<Functions />} />
            <Route path="logs" element={<Logs />} />
            <Route path="settings" element={<Settings />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default SideNav;
