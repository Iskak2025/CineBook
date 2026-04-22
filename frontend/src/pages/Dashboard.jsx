import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Ticket, Calendar, MapPin, Receipt, Trash2, Clock, Star, PlayCircle, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    // Mock data for tickets (representing database-fed entries)
    const mockTickets = [
        { id: 1, movieName: 'Batman: The Dark Knight', theaterName: 'Main Hall - Cinema City', date: '2026-04-12', time: '19:30', seat: 'Row E - Seat 10', price: 15.0, rating: 9.2, genre: 'Action' },
        { id: 2, movieName: 'Interstellar', theaterName: 'IMAX - Galaxy Theater', date: '2026-04-15', time: '21:00', seat: 'Row H - Seat 3', price: 18.0, rating: 8.8, genre: 'Sci-Fi' },
    ];

    return (
        <div className="page-body space-y-12">
            <header className="page-header" style={{ padding: '0 0 32px 0' }}>
                <div>
                    <h1 className="page-title">Personal Dashboard</h1>
                    <p className="page-subtitle">Welcome back, <span className="font-bold text-primary-color">{user?.username}</span>. Monitor your active reservations and viewing statistics.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
                <section className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Ticket className="text-primary" size={20} />
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Active Reservations</h2>
                    </div>

                    <div className="space-y-4">
                        {mockTickets.length > 0 ? mockTickets.map((ticket, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={ticket.id} 
                                className="ticket-card"
                            >
                                <div className="ticket-card-accent" />
                                <div className="ticket-card-body">
                                    <div className="flex-1 min-w-[240px] space-y-3">
                                        <div>
                                            <h3 className="ticket-card-title">{ticket.movieName}</h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="badge badge-gold">{ticket.genre}</span>
                                                <div className="flex items-center gap-1 text-gold text-xs font-bold">
                                                    <Star size={12} fill="currentColor" /> {ticket.rating}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="divider" />
                                        <div className="ticket-info-grid">
                                            <div>
                                                <p className="ticket-info-item-label">Theater & Venue</p>
                                                <p className="ticket-info-item-value">{ticket.theaterName}</p>
                                            </div>
                                            <div>
                                                <p className="ticket-info-item-label">Entry Logic</p>
                                                <p className="ticket-info-item-value">{ticket.seat}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 text-center border-l border-[var(--border)] border-dashed pl-8 pr-4">
                                        <div>
                                            <p className="ticket-info-item-label">Schedule</p>
                                            <p className="ticket-info-item-value">{ticket.date}</p>
                                            <p className="text-secondary text-xs">{ticket.time}</p>
                                        </div>
                                        <span className="badge badge-green">Confirmed</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button className="btn btn-icon btn-ghost" title="Reschedule">
                                            <Calendar size={18} />
                                        </button>
                                        <button className="btn btn-icon btn-danger-ghost" title="Cancel Booking">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="card card-pad empty-state">
                                <Bookmark size={48} className="empty-state-icon" />
                                <h3 className="empty-state-title">No Active Tickets</h3>
                                <p className="empty-state-desc">You haven't booked any movies recently. Time to find something new!</p>
                                <Link to="/movies" className="btn btn-primary mt-6">Explore Catalog</Link>
                            </div>
                        )}
                    </div>
                </section>

                <aside className="space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Receipt className="text-primary" size={20} />
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Statistics</h2>
                    </div>
                    <div className="card card-pad space-y-8">
                        <div className="stat-item space-y-1">
                            <p className="stat-card-label">Cinema Expenditure</p>
                            <p className="stat-card-value text-gold" style={{ fontSize: '36px' }}>$33.00</p>
                            <p className="text-success text-xs font-bold">+12% from last cycle</p>
                        </div>
                        <div className="divider" />
                        <div className="stat-item space-y-1">
                            <p className="stat-card-label">Attendance Metrics</p>
                            <p className="stat-card-value">12 <span className="text-xs text-muted">VISITS</span></p>
                            <p className="text-secondary text-xs">2 pending screenings</p>
                        </div>
                        <button className="btn btn-primary btn-full shadow-lg">
                            <PlayCircle size={18} /> Reserve New Unit
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Dashboard;
