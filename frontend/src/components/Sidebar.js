import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';


export default function Sidebar() {
    const [open, setOpen] = useState(true);

    const toggleSidebar = () => setOpen(prev => !prev);

    return (
        <>
            <button className='sidebar-toggle' onClick={toggleSidebar}>
                ☰
            </button>

            <aside className={`sidebar ${open ? ' open' : ' collapsed'}`}>
                <div className='sidebar-header'>
                    <h2 className='logo'>JobTracker</h2>
                </div>

                <nav className='sidebar-nav'>
                    <NavLink to="/jobs" className={({ isActive }) => isActive ? "active" : ""}>
                        Jobs
                    </NavLink>
                    <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
                        Profile
                    </NavLink>
                    <NavLink to="/setting" className={({ isActive }) => isActive ? "active" : ""}>
                        Setting
                    </NavLink>
                </nav>
            </aside>

        </>
    )

}