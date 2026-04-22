import React, { useState, useEffect } from 'react';
import { 
    getLocalMovies, deleteMovie, getAllUsers, updateUserRole, 
    updateUserStatus, deleteUser, getAdminStats, getUserTickets, cancelTicket 
} from '../services/api';
import { 
    Plus, Edit2, Trash2, Users, Film, Ticket, TrendingUp, 
    LayoutDashboard, Database, Search, Filter, Shield, 
    ShieldAlert, UserX, UserCheck, Eye, X, Loader2, DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [movieSearchTerm, setMovieSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userTickets, setUserTickets] = useState([]);
    const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
    const [isTicketsLoading, setIsTicketsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'dashboard') {
                const res = await getAdminStats();
                setStats(res.data);
            } else if (activeTab === 'movies') {
                const res = await getLocalMovies();
                setMovies(res.data);
            } else if (activeTab === 'users') {
                const res = await getAllUsers({ search: userSearchTerm });
                setUsers(res.data.content || []);
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
    };

    const handleDeleteMovie = async (id) => {
        if (window.confirm('Are you sure you want to delete this title?')) {
            try {
                await deleteMovie(id);
                setMovies(movies.filter(m => m.id !== id));
            } catch (error) {
                alert('Error removing title.');
            }
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            alert('Error updating role.');
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            await updateUserStatus(userId, !currentStatus);
            setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
        } catch (error) {
            alert('Error updating status.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (userId === currentUser.id) return alert("You cannot delete yourself!");
        if (window.confirm("Are you sure you want to delete this user? This action is permanent.")) {
            try {
                await deleteUser(userId);
                setUsers(users.filter(u => u.id !== userId));
            } catch (error) {
                alert('Error deleting user.');
            }
        }
    };

    const viewUserTickets = async (user) => {
        setSelectedUser(user);
        setIsTicketsModalOpen(true);
        setIsTicketsLoading(true);
        try {
            const res = await getUserTickets(user.id);
            setUserTickets(res.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setIsTicketsLoading(false);
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        if (window.confirm('Delete this booking? The seat will be released immediately.')) {
            try {
                await cancelTicket(ticketId);
                setUserTickets(userTickets.filter(t => t.id !== ticketId));
            } catch (error) {
                alert('Error deleting booking.');
            }
        }
    };

    return (
        <div className="page-body space-y-6 md:space-y-10" style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 80 }}>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6" style={{ padding: '10px 0 30px' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
                        Management Console
                    </h1>
                    <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
                        {['dashboard', 'movies', 'users'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{ 
                                    background: 'none', border: 'none', padding: '0 0 8px', color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: 800, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
                                    borderBottom: `2px solid ${activeTab === tab ? 'var(--primary)' : 'transparent'}`, transition: 'all 0.2s'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                {activeTab === 'movies' && (
                    <Link to="/movies/create" className="btn btn-primary" style={{ height: 48, padding: '0 24px', borderRadius: 14, fontWeight: 800 }}>
                        <Plus size={18} /> Add New Movie
                    </Link>
                )}
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                    <motion.div 
                        key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="stat-grid"
                    >
                        {[
                            { label: 'Total Titles', value: stats?.totalMovies || 0, icon: Film, color: '#3b82f6' },
                            { label: 'Active Bookings', value: stats?.totalTickets || 0, icon: Ticket, color: '#22c55e' },
                            { label: 'System Users', value: stats?.totalUsers || 0, icon: Users, color: '#a855f7' },
                            { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: '#f5c518' },
                        ].map((stat, i) => (
                            <div key={i} className="stat-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <stat.icon size={22} />
                                    </div>
                                </div>
                                <p className="stat-card-label">{stat.label}</p>
                                <p className="stat-card-value">{stat.value}</p>
                            </div>
                        ))}
                    </motion.div>
                )}

                {activeTab === 'movies' && (
                    <motion.section 
                        key="movies" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        style={{ background: 'var(--bg-card)', borderRadius: 28, overflow: 'hidden', border: '1px solid var(--border)' }}
                    >
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: 300 }}>
                                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                <input 
                                    type="text" placeholder="Search movies by title..." 
                                    value={movieSearchTerm} onChange={(e) => setMovieSearchTerm(e.target.value)}
                                    style={{ width: '100%', height: 40, padding: '0 12px 0 40px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: 13 }}
                                />
                            </div>
                            <select 
                                onChange={(e) => {
                                    const genre = e.target.value;
                                    if (genre === 'ALL') fetchData();
                                    else setMovies(movies.filter(m => m.genre === genre));
                                }}
                                style={{ height: 40, padding: '0 12px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: 13, fontWeight: 700 }}
                            >
                                <option value="ALL">All Genres</option>
                                <option value="ACTION">Action</option>
                                <option value="COMEDY">Comedy</option>
                                <option value="DRAMA">Drama</option>
                                <option value="THRILLER">Thriller</option>
                                <option value="HORROR">Horror</option>
                                <option value="SCI_FI">Sci-Fi</option>
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Title</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Genre</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movies.filter(m => m.movieName.toLowerCase().includes(movieSearchTerm.toLowerCase())).map(movie => (
                                        <tr key={movie.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <img src={movie.imgUrl} alt="" style={{ width: 36, height: 50, borderRadius: 6, objectFit: 'cover' }} />
                                                    <span style={{ fontWeight: 800 }}>{movie.movieName}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span className="badge badge-blue">{movie.genre}</span>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ color: 'var(--gold)', fontWeight: 800 }}>★ {movie.rating}</span>
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                    <Link to={`/movies/${movie.id}/edit`} className="btn btn-icon btn-ghost"><Edit2 size={14} /></Link>
                                                    <button onClick={() => handleDeleteMovie(movie.id)} className="btn btn-icon btn-danger-ghost"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.section>
                )}

                {activeTab === 'users' && (
                    <motion.section 
                        key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        style={{ background: 'var(--bg-card)', borderRadius: 28, overflow: 'hidden', border: '1px solid var(--border)' }}
                    >
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, flex: 1, maxWidth: 400 }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                    <input 
                                        type="text" placeholder="Search by name or email..." 
                                        value={userSearchTerm} onChange={(e) => setUserSearchTerm(e.target.value)}
                                        style={{ width: '100%', height: 40, padding: '0 12px 0 40px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: 13 }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ height: 40, padding: '0 16px' }}>Filter</button>
                            </form>
                        </div>
                        <div className="overflow-x-auto">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>User</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div>
                                                    <p style={{ fontWeight: 800, margin: 0 }}>{u.username}</p>
                                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{u.email}</p>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <select 
                                                    value={u.role} 
                                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: 8, padding: '4px 8px', fontSize: 12, fontWeight: 700 }}
                                                >
                                                    <option value="User">USER</option>
                                                    <option value="Admin">ADMIN</option>
                                                </select>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <button 
                                                    onClick={() => handleStatusToggle(u.id, u.isActive)}
                                                    style={{ 
                                                        background: u.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                                        color: u.isActive ? '#22c55e' : '#ef4444',
                                                        border: 'none', padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 900, cursor: 'pointer'
                                                    }}
                                                >
                                                    {u.isActive ? 'ACTIVE' : 'BLOCKED'}
                                                </button>
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                    <button onClick={() => viewUserTickets(u)} className="btn btn-icon btn-ghost" title="View Bookings"><Eye size={14} /></button>
                                                    <button onClick={() => handleDeleteUser(u.id)} className="btn btn-icon btn-danger-ghost" title="Delete User"><UserX size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Tickets Modal */}
            <AnimatePresence>
                {isTicketsModalOpen && (
                    <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-content" style={{ width: '100%', maxWidth: 600, padding: 0, overflow: 'hidden' }}
                        >
                            <div style={{ padding: '20px 24px', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontWeight: 900 }}>Bookings for {selectedUser?.username}</h3>
                                <button onClick={() => setIsTicketsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <div style={{ padding: 24, maxHeight: 400, overflowY: 'auto' }}>
                                {isTicketsLoading ? (
                                    <div style={{ textAlign: 'center', padding: 40 }}><Loader2 className="animate-spin" /></div>
                                ) : userTickets.length > 0 ? (
                                    <div className="space-y-4">
                                        {userTickets.map(t => (
                                            <div key={t.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <p style={{ fontWeight: 800, fontSize: 14, margin: 0 }}>{t.movieName}</p>
                                                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0' }}>{t.showDate} • {t.showTime}</p>
                                                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>Seats: {t.bookedSeats}</p>
                                                </div>
                                                <button onClick={() => handleDeleteTicket(t.id)} className="btn btn-icon btn-danger-ghost" title="Delete Booking"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ textAlign: 'center', opacity: 0.5, margin: '40px 0' }}>No active bookings found for this user.</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPanel;
