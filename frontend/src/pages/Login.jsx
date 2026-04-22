import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await loginUser(formData);
            const { token, username, id, role, email } = response.data;
            login({ id, username, role, email }, token);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials. Please verify your username and password.');
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
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Sign in to your account to continue</p>
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
                                placeholder="Enter your username"
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
                        {loading ? <span className="spinner spinner-sm" /> : <>Sign In <ArrowRight size={18} /></>}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register" className="auth-link">Create Account</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
