import React, { useEffect, useState } from 'react';
import { jobSummary } from '../services/api';
import JobCard from './JobCards';
import '../styles/sidebar.css';


export default function Sidebar(params) {
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false)
    const [statusCount, setStatusCount] = useState([]);
    const [topThree, setTopThree] = useState([]);
    const [upcomingInterview, setUpcomingInterview] = useState([]);

    const toggleSidebar = () => {
        setOpen(prev => !prev)
        params.toggleBar('summary');
    }

    useEffect(() => {
        async function init() {
            try {
                setLoading(true);

                const data = await jobSummary();

                setTopThree(data.topThree);
                setStatusCount(data.statusList);
                setUpcomingInterview(data.upcomingInterview);

            } catch (err) {
                throw new Error(err)
            } finally {
                setLoading(false);
            }

        }
        init();
    }, [open])
    
    useEffect(() => {
        setOpen(prev => params.forceToggle && prev);
    },[params.forceToggle])

    return (
        <>
            <button className='sidebar-toggle summary' onClick={toggleSidebar}>
                ☰
            </button>

            <aside className={` summary sidebar ${open ? ' open' : ' collapsed'}`}>
                <div className='sidebar-header'>
                    <h3 className='logo'>Summary</h3>
                </div>
                
                <nav className='sidebar-nav'>
                    <div className='jobs-status'>
                        <h4>Jobs Status</h4>
                        
                        {!loading?<ul className='list'>
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
                </nav>
            </aside>

        </>
    )

}