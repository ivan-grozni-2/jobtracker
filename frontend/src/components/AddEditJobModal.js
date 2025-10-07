import React, { useState, useEffect } from 'react';
import { createJob, updateJob } from '../services/api';

export default function AddEditJobModal(modal) {

    const [form, setForm] = useState({
        title: '',
        company: '',
        status: 'applied',
        salary: 0,
        note: '',
        coverLetter: '',
        skill: [],
        appliedDate: '',
        releaseDate: '',
        interviewDate: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (modal.job) {
            let job = modal.job;
            setForm({
                title: job.title || '',
                company: job.company || '',
                status: job.status || 'applied',
                salary: job.salary || 0,
                note: job.note || '',
                coverLetter: job.cover_letter || '',
                skill: job.skill || [],
                appliedDate: job.applied_date || '',
                releaseDate: job.release_date || '',
                interviewDate: job.interview_date || ''

            });
        } else {
            setForm({
                title: '',
                company: '',
                status: 'applied',
                salary: 0,
                note: '',
                coverLetter: '',
                skill: [],
                appliedDate: '',
                releaseDate: '',
                interviewDate: ''
            })
        }
    }, [modal.job]);

    if (!modal.open) return null;

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }


    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (modal.job) {
                await updateJob(modal.job.id, form);

            } else {
                await createJob(form);
            }
            modal.onSuccess();
            modal.onClose();
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <h3>{modal.job ? 'Edit Job' : 'Add New Job'}</h3>

                <form onSubmit={handleSubmit}>
                    <div className="inputcontainer">
                        <input
                            className="input"
                            type='text'
                            name='title'
                            value={form.title}
                            onChange={handleChange}
                        />
                        <label className="inputName"> Job title </label>
                    </div>
                    <div className="inputcontainer">
                        <input
                            className="input"
                            type='text'
                            name='company'
                            value={form.company}
                            onChange={handleChange}
                        />
                        <label className="inputName"> Company </label>
                    </div>
                    <div className="inputcontainer">
                        <input
                            className="input"
                            type='number'
                            name='salary'
                            value={form.salary}
                            onChange={handleChange}
                        />
                        <label className="inputName"> Salary </label>
                    </div>

                    <div className="inputcontainer">
                        <input
                            className="input"
                            type='date'
                            name='appliedDate'
                            value={form.appliedDate}
                            onChange={handleChange}
                        />
                        <label className="altInputName"> Applied Date </label>
                    </div>
                    <div className="inputcontainer">
                        <input
                            className="input"
                            type='date'
                            name='releaseDate'
                            value={form.releaseDate}
                            onChange={handleChange}
                        />
                        <label className="altInputName"> Release Date </label>
                    </div>
                    <div className="inputcontainer">
                        <input
                            className="input"
                            type='date'
                            name='interviewDate'
                            value={form.interviewDate}
                            onChange={handleChange}
                        />
                        <label className="altInputName"> Interview Date </label>
                    </div>


                    <div className="inputcontainer">
                        <textarea
                            className="input"
                            name='note'
                            value={form.note}
                            onChange={handleChange}
                        />
                        <label className="inputName"> Notes </label>
                    </div>
                    <div className="inputcontainer">
                        <textarea
                            className="input"
                            name='coverLetter'
                            value={form.coverLetter}
                            onChange={handleChange}
                        />
                        <label className="inputName"> Cover Letter </label>
                    </div>

                    <div className="inputcontainer">
                        <select className="input" name='status' value={form.status} onChange={handleChange}>
                            <option value="applied"> Applied </option>
                            <option value="hired"> Hired </option>
                            <option value="rejected"> Rejected </option>
                            <option value="fired"> Fired </option>
                            <option value="resigned"> Resigned </option>
                        </select>
                        <label className="inputName"> Status </label>
                    </div>

                    {error && <p className='error'>{error}</p>}

                    <div className='modal-actions'>
                        <button type='button' onClick={modal.onClose}>Cancel</button>
                        <button type='submit' disabled={loading}> {loading ? 'Saving...' : "Save"}</button>
                    </div>

                </form>
            </div>
        </div>
    )


}