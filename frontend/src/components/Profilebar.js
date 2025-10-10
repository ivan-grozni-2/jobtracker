import React, { useEffect, useState } from 'react';
//import { updateProfile } from '../services/api';
import '../styles/sidebar.css';


export default function Profilebar(params) {
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({ email: '', name: '', experience: 0, skill: [] })
    const [skills, setSkills] = useState([])

    const toggleSidebar = () => {
        setOpen(prev => !prev)
        params.toggleBar('profile');
    }

    useEffect(() => {
        setProfile(params.onGet());
        setSkills(params.onGet().skills.map((s) => ( s = s.skill )))

    }, [open, params])

    useEffect(() => {
        setOpen(prev => params.forceToggle && prev);
    },[params.forceToggle])

    return (
        <>
            <button className='sidebar-toggle profile' onClick={toggleSidebar}>
                {profile.name.slice(0,2).toUpperCase()}
            </button>
            {loading && <p>loading...</p>}
            <aside className={`sidebar profile ${open ? ' open' : ' collapsed'}`}>
                <div className='sidebar-header'>
                    <h3 className='logo'>{profile.name}</h3>
                    <p className='email'>{profile.email}</p>
                </div>


                <nav className='sidebar-nav'>
                    <div className='experience'>
                        <h4>Years of experience</h4>
                        <p>{profile.experience}</p>
                    </div>
                    <div className='list'>
                        <h4>Your Skills</h4>
                            <ul className='user skill'>
                                {
                                    skills.map((s, i) => (
                                        <li className={`skills ${s}`} key={i}>
                                            {s}
                                        </li>
                                    ))
                                }
                            </ul>
                    </div>
                </nav>
            </aside>

        </>
    )

}