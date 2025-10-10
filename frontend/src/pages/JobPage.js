import React, { useState, useEffect } from 'react';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCards';
import FilterBar from '../components/FilterBar';
import PaginationControls from '../components/PaginationControl';
import AddEditJobModal from '../components/AddEditJobModal'
import { deleteJob } from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import Profilebar from '../components/Profilebar';

import '../styles/job.css';


export default function JobPage() {

    const { logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        company: '',
        title: '',
        salary: '',
        releaseDateFrom: '',
        releaseDateTo: '',
        appliedDateFrom: '',
        appliedDateTo: '',
        interviewDateFrom: '',
        interviewDateTo: '',
        skill: '',
        page: 1,
        limit: 6,
        sort: 'applied_date:desc'
    });
    const [meta, setMeta] = useState({ totalPages: 1, pageNum: 0 });
    const [modalOpen, setModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [user, setUser] = useState({});
    const [openProfile, setOpenProfile] = useState(true);
    const [openSummary, setOpenSummary] = useState(true);


    useEffect(() => {
        async function loadJobs() {
            try {
                setLoading(true);
                const data = await getJobs(filters);
                setJobs(data.jobs);
                setMeta({ totalPages: data.TotalPage, pageNum: data.page });
            } catch (err) {
                console.log("err ", JSON.stringify(err))
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadJobs();

    }, [filters]);

    const getProfile = () => {
        return JSON.parse(localStorage.getItem('userDetail'));
    }

    const updateProfile = () => {
        setUser(JSON.parse(localStorage.getItem('userDetail')));
        return JSON.parse(localStorage.getItem('userDetail'));
    };

    const toggleBar = (side) => {
        if(side === 'profile'){
            setOpenSummary(false);
            setOpenProfile(true);
        }
        if(side === 'summary'){
            setOpenProfile(false);
            setOpenSummary(true);
        }
    }

    function reset(exception) {

        const resetData = {
            search: '',
            status: '',
            company: '',
            title: '',
            salary: '',
            releaseDateFrom: '',
            releaseDateTo: '',
            appliedDateFrom: '',
            appliedDateTo: '',
            interviewDateFrom: '',
            interviewDateTo: '',
            skill: '',
            page: 1,
            limit: 6,
            sort: 'applied_date:desc'
        }
        setFilters({ ...resetData, ...exception });
    }

    function handleFilterChange(newFilters) {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    }

    function handlePageChange(newpage) {
        setFilters(prev => ({ ...prev, page: newpage }));

    }

    const handleLogout = async () => {
        await logout();
        navigate('/logout');
    }

    return (
        <div className='dashboard-layout'>
            <Sidebar forceToggle = {openSummary} toggleBar={toggleBar} />
            
           { <Profilebar  toggleBar={toggleBar}  user={user} onUpdate={updateProfile} onGet = {getProfile} forceToggle = {openProfile} />
           }
            <div className="dashboard">
                <header className='dashboard-header'>
                    <div className='header-left'>
                        <h1 className='app-title'>Job Tracker</h1>
                        <p className='subtitle'>Manage and track your job application</p>
                    </div>
                    <div className='header-right'>
                        <button onClick={toggleTheme} className="theme">
                            {theme === 'light' ? '👓' : '🕶'}
                        </button>
                        <button onClick={handleLogout}>logout</button>
                    </div>
                </header>
                <main className='dashboard-content'>
                    <div className='dashboard-control'>
                        <FilterBar filters={filters} onChange={handleFilterChange} onReset={reset} />
                        <button className='add' onClick={() => { setEditingJob(null); setModalOpen(true); }}> + </button>
                    </div>
                    {loading && <p>Loading jobs...</p>}
                    {error && <p className='error'>{error}</p>}

                    <div className="job-grid">
                        {jobs.map(job => (
                            <JobCard
                                skill = {getProfile().skills}
                                key={job.id}
                                job={job}
                                onEdit={() => { setEditingJob(job); setModalOpen(true); }}
                                onDelete={async () => {
                                    if (window.confirm(`Are you sure`)) {
                                        await deleteJob(job.id);
                                        const updated = jobs.filter(j => j.id !== job.id);
                                        setJobs(updated);
                                    }
                                }}
                            />
                        ))}
                    </div>

                    <PaginationControls
                        page={filters.page}
                        totalPages={meta.totalPages}
                        onChange={handlePageChange}
                    />

                </main>
                <AddEditJobModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    job={editingJob}
                    onSuccess={() => setFilters(f => ({ ...f }))}
                />

            </div>
        </div>
    );

}