import React from 'react';
import '../styles/job.css'

export default function JobCard(jobs) {
    const job = jobs.job;

    const matchSkill = (comp) => {
        const skill = jobs.skill.map((s) => (s = s.skill.toLowerCase()))
        return skill.includes(comp.toLowerCase());

    }

    return (
        <div className="job-card">
            <h3>{job.title}</h3>
            <p><strong> Company: </strong> {job.company} </p>
            <p><strong> Status: </strong> {job.status} </p>
            {job.salary && <p><strong> Salary: </strong> {job.salary} </p>}
            {job.applied_date && <p><strong> Applied: </strong> {new Date(job.applied_date).toLocaleDateString()} </p>}
            {job.release_date && <p><strong> Released: </strong> {new Date(job.release_date).toLocaleDateString()} </p>}
            {job.interview_date && <p><strong> Interview: </strong> {new Date(job.interview_date).toLocaleDateString()} </p>}
            {
                job.skills && (
                    <div className="skills">
                        {
                            job.skills.map((s, i) => (
                                <span key={i} className={"skill " + (matchSkill(s)?"match":"")}>{s}</span>
                            ))
                        }
                    </div>)
            }
            {!jobs.edit && <div className='job-actions'>
                <button onClick={jobs.onEdit} className='edit'>🖊</button>
                <button onClick={jobs.onDelete} className='delete'>🗑</button>
            </div>}

        </div>
    )
}