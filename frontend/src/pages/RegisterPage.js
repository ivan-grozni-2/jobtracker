import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css'

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(form);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
            <div className="inputcontainer">
                    <input
                        className="input"
                        type='name'
                        name='name'
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <label className="inputName"> Username </label>
                </div>
            <div className="inputcontainer">
                    <input
                        className="input"
                        type='email'
                        name='email'
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <label className="inputName"> Email </label>
                </div>
                <div className="inputcontainer">
                    <input
                        className="input"
                        type='password'
                        name='password'
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <label className="inputName"> Password </label>
                </div>

                <button  type='submit' className={loading?'button':'btn'} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                {error && <p className='error'>{error}</p>}
                <p>Already have an account? <br/><Link className='links' to="/login">Login</Link></p>

            </form>
        </div>
    )
}