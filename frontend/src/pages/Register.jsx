import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react';
import { registerUser } from '../services/api';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await registerUser(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try a different username or email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card shadow-2xl"
            >
                <div className="auth-brand">
                    <div className="auth-brand-icon">
                        <ShieldCheck size={22} color="white" />
                    </div>
                    <span className="auth-brand-name">CineBook</span>
                </div>

                <div className="auth-header">
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join CineBook to start your cinema journey</p>
                </div>

                {error && <div className="alert alert-error mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div className="form-input-icon">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Pick a username"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="form-input-icon">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="form-input-icon">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full mt-2">
                        {loading ? <span className="spinner spinner-sm" /> : <>Sign Up <UserPlus size={18} /></>}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Log In Instead</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
