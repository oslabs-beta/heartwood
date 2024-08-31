import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Functions from '../components/Functions';
import Logs from '../components/Logs';
import Settings from '../components/Settings';

const SideNav = () => {
    return (
        <Router>
            <div className="drawer drawer-mobile z-0">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    {/* Button to toggle sidebar */}
                    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                        Open Sidebar
                    </label>
                    {/* Page Content */}
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="functions" element={<Functions />} />
                        <Route path="logs" element={<Logs />} />
                        <Route path="settings" element={<Settings />} />
                    </Routes>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 bg-base-200 text-base-content">
                        {/* Sidebar content here */}
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
            </div>
        </Router>
    );
}

export default SideNav;

