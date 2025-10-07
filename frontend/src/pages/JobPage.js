import React, { useState, useEffect } from 'react';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCards';
import FilterBar from '../components/FilterBar';
import PaginationControls from '../components/PaginationControl';
import AddEditJobModal from '../components/AddEditJobModal'
import { deleteJob } from '../services/api';
import '../styles/job.css';

export default function JobPage() {

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
        limit: 5,
        sort: 'applied_date:desc'
    });
    const [meta, setMeta] = useState({ totalPages: 1, pageNum: 0 });
    const [modalOpen, setModalOpen] = useState(false)
    const [editingJob, setEditingJob] = useState(null)

    useEffect(() => {
        async function loadJobs() {
            try {
                setLoading(true);
                const data = await getJobs(filters);
                setJobs(data.jobs);
                setMeta({ totalPages: data.TotalPage, pageNum: data.page });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadJobs();
    }, [filters]);

    function handleFilterChange(newFilters) {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    }

    function handlePageChange(newpage) {
        setFilters(prev => ({ ...prev, page: newpage }));

    }

    return (
        <div className="job-container">
            <h2>Job Tracker</h2>

            <button className='button' onClick={() => { setEditingJob(null); setModalOpen(true); }}> +Add </button>

            <FilterBar filters={filters} onChange={handleFilterChange} />

            {loading && <p>Loading jobs...</p>}
            {error && <p classname='error'>{error}</p>}

            <div classname="job-list">
                {jobs.map(job => (
                    <JobCard
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

            <AddEditJobModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                job={editingJob}
                onSuccess={() => setFilters(f => ({ ...f }))}
            />

            <PaginationControls
                page={filters.page}
                totalPages={meta.totalPages}
                onChange={handlePageChange}
            />

        </div>
    );

}