import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css'

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
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
            await login(form.email, form.password);
            navigate('/jobs');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className='auth-container'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="auth inputcontainer">
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

                <button type='submit' className={loading?'button':'btn'} disabled = {loading}>{loading ? 'logging in...': 'Login'}</button>
                {error && <p className='error'>{error}</p>}
                <p>No account? <Link className='links' to="/register">Register here</Link></p>

            </form>
        </div>
    )

}