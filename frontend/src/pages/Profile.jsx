import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Settings, Key, Bell, Save, LogOut, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Profile = () => {
    const { user, token, login, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            if (!user?.id) throw new Error('User ID not found. Please log in again.');
            
            const response = await api.put(`/users/${user.id}`, {
                ...formData,
                role: user.role
            });
            
            // Update context and local storage with new data and NEW token
            login(response.data, response.data.token);
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setIsLoading(false);
            // Clear message after 3 seconds
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        }
    };

    return (
        <div className="page-body space-y-10" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header className="page-header" style={{ padding: '0 0 32px 0' }}>
                <div>
                    <h1 className="page-title">Profile Settings</h1>
                    <p className="page-subtitle">Manage your personal information and account preferences.</p>
                </div>
            </header>

            <AnimatePresence>
                {status.message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} flex items-center gap-2`}
                    >
                        {status.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                        {status.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10">
                <nav className="space-y-1">
                    <button className="nav-item active flex items-center gap-2 w-full text-left">
                        <User size={18} /> General
                    </button>
                    <button className="nav-item flex items-center gap-2 w-full text-left">
                        <Key size={18} /> Security
                    </button>
                    <button className="nav-item flex items-center gap-2 w-full text-left">
                        <Bell size={18} /> Notifications
                    </button>
                    <button className="nav-item flex items-center gap-2 w-full text-left">
                        <Settings size={18} /> Preferences
                    </button>
                    <div className="divider" style={{ margin: '8px 0' }} />
                    <button onClick={logout} className="nav-item nav-item-danger flex items-center gap-2 w-full text-left">
                        <LogOut size={18} /> Sign Out
                    </button>
                </nav>

                <div className="card card-pad-lg space-y-10">
                    <div className="flex items-center gap-6 pb-10 border-b border-[var(--border)]">
                        <div className="profile-avatar overflow-hidden">
                            {user?.username?.[0].toUpperCase()}
                        </div>
                        <div className="space-y-1">
                            <h2 className="section-title" style={{ marginBottom: 0 }}>{user?.username}</h2>
                            <div className="flex items-center gap-2">
                                <span className="badge badge-gold">{user?.role || 'REGULAR USER'}</span>
                                <span className="text-xs text-muted font-medium italic">Member since April 2026</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="form-group">
                                <label className="form-label flex items-center gap-2">
                                    <User size={14} /> Full Username
                                </label>
                                <input 
                                    type="text" 
                                    name="username"
                                    value={formData.username} 
                                    onChange={handleChange}
                                    className="form-input" 
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label flex items-center gap-2">
                                    <Mail size={14} /> Contact Email
                                </label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email} 
                                    onChange={handleChange}
                                    className="form-input" 
                                    placeholder="Enter email address"
                                />
                            </div>
                            <div className="form-group sm:col-span-2">
                                <label className="form-label flex items-center gap-2">
                                    <Shield size={14} /> Access Permission
                                </label>
                                <div className="alert alert-info flex items-center gap-2">
                                    <strong>System Rank:</strong> {user?.role || 'STUDENT_CLIENT'}
                                </div>
                            </div>
                            <div className="form-group sm:col-span-2">
                                <label className="form-label flex items-center gap-2">
                                    <Key size={14} /> New Password (leave blank to keep current)
                                </label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={formData.password} 
                                    onChange={handleChange}
                                    className="form-input" 
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={() => setFormData({ username: user.username, email: user.email || '', password: '' })}
                                className="btn btn-ghost"
                            >
                                Revert Changes
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary px-10 shadow-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Updating...' : <><Save size={18} /> Update Profile</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
