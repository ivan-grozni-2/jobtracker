import React from 'react';

export default function JobCard(jobs) {
    const job = jobs.job;
    return (
        <div className="job-card">
            <h3>{job.title}</h3>
            <p><strong> Company: </strong> {job.company} </p>
            <p><strong> Status: </strong> {job.status} </p>
            {job.salary && <p><strong> Salary: </strong> {job.salary} </p>}
            <p><strong> Applied: </strong> {new Date(job.applied_date).toLocaleDateString()} </p>
            <p><strong> Released: </strong> {new Date(job.release_date).toLocaleDateString()} </p>
            <p><strong> Interview: </strong> {new Date(job.interview_date).toLocaleDateString()} </p>
            {
                job.skills && (
                    <div className="skills">
                        {
                            job.skills.map((s, i) => (
                                <span key={i} className="skill">{s}</span>
                            ))
                        }
                    </div>)
            }
            <div className='job-actions'>
                <button onClick={jobs.onEdit} className='button edit'>🖊</button>
                <button onClick={jobs.onDelete} className='button delete'>🗑</button>
            </div>

        </div>
    )
}