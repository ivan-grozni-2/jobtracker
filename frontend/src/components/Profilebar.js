import React, { useEffect, useState } from 'react';
//import { updateProfile } from '../services/api';
import '../styles/sidebar.css';


export default function Profilebar(params) {
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({ email: '', name: '', experience: 0, skill: [] })
    const [skills, setSkills] = useState([])

    const toggleSidebar = () => setOpen(prev => !prev);

    useEffect(() => {
        setProfile(params.onGet());
        setSkills(params.onGet().skills.map((s) => ( s = s.skill )))

    }, [open, params.user])

    return (
        <>
            <button className='sidebar-toggle profile' onClick={toggleSidebar}>
                ☰
            </button>
            {loading && <p>loading...</p>}
            <aside className={`profile ${open ? ' open' : ' collapsed'}`}>
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
                            <ul className='pskill list'>
                                {
                                    skills.map((s, i) => (
                                        <li className={`skill match ${s}`} key={i}>
                                            {s}
                                        </li>
                                    ))
                                }
                            </ul>
                    </div>

                </nav>




                {/*<nav className='sidebar-nav'>
                    <div className='jobs-status'>
                        <h4>Jobs Status</h4>
                        {loading?<ul className='list'>
                            {
                                statusCount.map((s, i) => (
                                    <li className={`entry ${s.status}`} key={i}>
                                        <p>{s.status}</p>
                                        <p>{s.total}</p>
                                    </li>
                                ))
                            }
                        </ul>: <p>loading...</p>}

                    </div>
                    
                    <div className='upcoming'>
                        <h4>Upcoming Interview</h4>
                        <div className='list'>
                            {
                                upcomingInterview.map((s, i) => (
                                    <JobCard
                                        key={s.id}
                                        job={s}
                                        edit={true}
                                    />
                                ))
                            }
                        </div>
                    </div>

                    <div className='top-three'>
                        <h4>Latest application</h4>
                        <div className='list'>
                            {
                                topThree.map((s, i) => (
                                    <JobCard
                                        key={s.id}
                                        job={s}
                                        edit={true}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </nav>*/}
            </aside>

        </>
    )

}