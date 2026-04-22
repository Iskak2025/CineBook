import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Ticket, Calendar, Clock, MapPin, Trash2, CheckCircle,
    AlertCircle, Film, ChevronRight, CreditCard, Armchair,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getUserTickets, cancelTicket } from '../services/api';

/* ─── helper: format time "14:00:00.341" → "14:00" ─── */
const fmtTime = (t) => {
    if (!t) return '—';
    return String(t).substring(0, 5);
};

/* ─── helper: format date "2026-04-18" → "Apr 18, 2026" ─── */
const fmtDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
};

/* ─── helper: is show in the past? ─── */
const isPast = (date, time) => {
    if (!date) return false;
    const dt = new Date(`${date}T${time || '23:59'}`);
    return dt < new Date();
};

/* ─── Ticket Card ─── */
const BookingCard = ({ booking, onCancel, index }) => {
    const [cancelling, setCancelling] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const past = isPast(booking.showDate, booking.showTime);
    const seats = booking.bookedSeats ? booking.bookedSeats.split(',').map(s => s.trim()) : [];

    const handleCancel = async () => {
        setCancelling(true);
        await onCancel(booking.id);
        setCancelling(false);
        setShowConfirm(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            style={{
                background: 'var(--bg-card)',
                border: `1px solid ${past ? 'var(--border)' : 'var(--border)'}`,
                borderRadius: 20,
                overflow: 'hidden',
                opacity: past ? 0.65 : 1,
                transition: 'box-shadow 0.2s',
            }}
        >
            {/* Top accent bar */}
            <div style={{
                height: 4,
                background: past
                    ? 'var(--bg-elevated)'
                    : 'linear-gradient(90deg, var(--primary) 0%, #ff6b6b 100%)',
            }} />

            <div style={{ padding: '24px 28px', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>

                {/* QR / Icon side */}
                <div style={{
                    width: 80, height: 80, borderRadius: 16, flexShrink: 0,
                    background: past ? 'var(--bg-elevated)' : 'rgba(229,9,20,0.1)',
                    border: `1.5px dashed ${past ? 'var(--border)' : 'rgba(229,9,20,0.3)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Ticket size={34} style={{ color: past ? 'var(--text-muted)' : 'var(--primary)', opacity: past ? 0.4 : 1 }} />
                </div>

                {/* Main info */}
                <div style={{ flex: 1, minWidth: 220 }}>
                    {/* Status badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 12px', borderRadius: 99, marginBottom: 10,
                        fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase',
                        background: past ? 'rgba(138,138,154,0.1)' : 'rgba(34,197,94,0.1)',
                        color: past ? 'var(--text-muted)' : '#4ade80',
                        border: `1px solid ${past ? 'var(--border)' : 'rgba(34,197,94,0.2)'}`,
                    }}>
                        <CheckCircle size={11} />
                        {past ? 'Past' : 'Confirmed'}
                    </div>

                    <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 12, color: 'var(--text)', lineHeight: 1.2 }}>
                        {booking.movieName || 'Movie'}
                    </h3>

                    {/* Meta chips */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[
                            { icon: <Calendar size={13} />, val: fmtDate(booking.showDate) },
                            { icon: <Clock size={13} />, val: fmtTime(booking.showTime) },
                            { icon: <MapPin size={13} />, val: `Hall ${booking.showId || '—'}` },
                        ].map(({ icon, val }) => (
                            <span key={val} style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '5px 12px', borderRadius: 10,
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                fontSize: 12, fontWeight: 700,
                                color: 'var(--text-secondary)',
                            }}>
                                {icon} {val}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: seats + price + action */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14, minWidth: 160 }}>
                    {/* Price */}
                    {booking.price != null && (
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 2 }}>
                                Total paid
                            </p>
                            <p style={{ fontSize: 26, fontWeight: 900, color: 'var(--primary)' }}>
                                ${booking.price}
                            </p>
                        </div>
                    )}

                    {/* Seats */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {seats.map(seat => (
                            <span key={seat} style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                padding: '5px 10px', borderRadius: 8,
                                background: past ? 'var(--bg-elevated)' : 'rgba(229,9,20,0.08)',
                                border: `1px solid ${past ? 'var(--border)' : 'rgba(229,9,20,0.2)'}`,
                                fontSize: 13, fontWeight: 800,
                                color: past ? 'var(--text-muted)' : 'var(--primary)',
                            }}>
                                <Armchair size={11} /> {seat}
                            </span>
                        ))}
                    </div>

                    {/* Cancel button */}
                    {!past && (
                        <AnimatePresence mode="wait">
                            {!showConfirm ? (
                                <motion.button
                                    key="cancel-btn"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={() => setShowConfirm(true)}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '7px 14px', borderRadius: 10,
                                        border: '1px solid var(--border)',
                                        background: 'transparent',
                                        fontSize: 12, fontWeight: 700,
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer', transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <Trash2 size={13} /> Cancel
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="confirm-btns"
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                    style={{ display: 'flex', gap: 8 }}
                                >
                                    <button onClick={() => setShowConfirm(false)} style={{
                                        padding: '7px 14px', borderRadius: 10, border: '1px solid var(--border)',
                                        background: 'transparent', fontSize: 12, fontWeight: 700,
                                        color: 'var(--text-muted)', cursor: 'pointer',
                                    }}>
                                        Keep
                                    </button>
                                    <button onClick={handleCancel} disabled={cancelling} style={{
                                        padding: '7px 14px', borderRadius: 10, border: 'none',
                                        background: 'rgba(239,68,68,0.15)', fontSize: 12, fontWeight: 800,
                                        color: '#f87171', cursor: 'pointer',
                                    }}>
                                        {cancelling ? 'Cancelling…' : 'Yes, cancel'}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Divider + seat count footer */}
            <div style={{
                borderTop: '1px solid var(--border)',
                padding: '12px 28px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--bg-elevated)',
            }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                    {seats.length} seat{seats.length !== 1 ? 's' : ''} reserved
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                    Booking #{String(booking.id).padStart(4, '0')}
                </span>
            </div>
        </motion.div>
    );
};

/* ─── Main Page ─── */
const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ type: '', message: '' });
    const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'past'

    useEffect(() => { fetchBookings(); }, [user?.id]);

    const fetchBookings = async () => {
        if (!user?.id) { setIsLoading(false); return; }
        try {
            const res = await getUserTickets(user.id);
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async (id) => {
        try {
            await cancelTicket(id);
            setBookings(prev => prev.filter(b => b.id !== id));
            showToast('success', 'Booking cancelled successfully.');
        } catch (err) {
            showToast('error', 'Failed to cancel booking.');
        }
    };

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast({ type: '', message: '' }), 3500);
    };

    const upcoming = bookings.filter(b => !isPast(b.showDate, b.showTime));
    const past     = bookings.filter(b =>  isPast(b.showDate, b.showTime));

    const displayed = filter === 'upcoming' ? upcoming
                    : filter === 'past'     ? past
                    : bookings;

    if (isLoading) return (
        <div className="loading-page">
            <div className="spinner" />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 16 }}>Loading your bookings…</p>
        </div>
    );

    return (
        <div style={{ paddingBottom: 80 }}>

            {/* ══ TOAST ══ */}
            <AnimatePresence>
                {toast.message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 24, right: 24, zIndex: 9999,
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '14px 20px', borderRadius: 14,
                            background: toast.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                            border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                            backdropFilter: 'blur(12px)',
                            color: toast.type === 'success' ? '#4ade80' : '#f87171',
                            fontWeight: 700, fontSize: 14,
                        }}
                    >
                        {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══ HEADER ══ */}
            <div style={{ padding: '36px 48px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 14,
                        background: 'rgba(229,9,20,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Ticket size={22} style={{ color: 'var(--primary)' }} />
                    </div>
                    <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.5px' }}>My Bookings</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
                    Manage your reservations and your cinematic schedule.
                </p>

                {/* Stats strip */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    borderRadius: 16, overflow: 'hidden',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    marginBottom: 28,
                }}>
                    {[
                        { label: 'Total Bookings', value: bookings.length, icon: <Ticket size={16} />, color: 'var(--primary)' },
                        { label: 'Upcoming',       value: upcoming.length,  icon: <Calendar size={16} />, color: '#4ade80' },
                        { label: 'Total Spent',    value: `$${bookings.reduce((s, b) => s + (b.price || 0), 0)}`, icon: <CreditCard size={16} />, color: '#f5c518' },
                    ].map((s, i) => (
                        <div key={s.label} style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '18px 22px',
                            borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                        }}>
                            <div style={{
                                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: s.color,
                                background: s.color === 'var(--primary)' ? 'rgba(229,9,20,0.1)'
                                    : s.color === '#4ade80' ? 'rgba(34,197,94,0.1)'
                                    : 'rgba(245,197,24,0.1)',
                            }}>
                                {s.icon}
                            </div>
                            <div>
                                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: 0 }}>{s.label}</p>
                                <p style={{ fontSize: 22, fontWeight: 900, margin: '2px 0 0', color: 'var(--text)' }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter tabs */}
                {bookings.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                        {[
                            { key: 'all',      label: `All (${bookings.length})` },
                            { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
                            { key: 'past',     label: `Past (${past.length})` },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
                                padding: '8px 18px', borderRadius: 10, cursor: 'pointer',
                                fontSize: 13, fontWeight: 700, transition: 'all 0.15s',
                                border: filter === tab.key ? 'none' : '1px solid var(--border)',
                                background: filter === tab.key ? 'var(--primary)' : 'transparent',
                                color: filter === tab.key ? 'white' : 'var(--text-secondary)',
                            }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ══ CONTENT ══ */}
            <div style={{ padding: '0 48px' }}>
                {bookings.length === 0 ? (
                    /* ── empty state ── */
                    <motion.div
                        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', paddingTop: 80 }}
                    >
                        <div style={{
                            width: 100, height: 100, borderRadius: '50%',
                            background: 'var(--bg-elevated)',
                            border: '1.5px dashed var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                        }}>
                            <Film size={40} style={{ opacity: 0.15 }} />
                        </div>
                        <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 10 }}>No Bookings Yet</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.65, maxWidth: 360, margin: '0 auto 28px' }}>
                            Your cinematic schedule is empty. Find a movie and book your first ticket!
                        </p>
                        <Link to="/" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '14px 32px', borderRadius: 14,
                            background: 'var(--primary)', color: 'white',
                            fontWeight: 900, fontSize: 15, textDecoration: 'none',
                            boxShadow: '0 6px 24px rgba(229,9,20,0.3)',
                        }}>
                            <Film size={17} /> Browse Films <ChevronRight size={16} />
                        </Link>
                    </motion.div>
                ) : displayed.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}
                    >
                        <p style={{ fontSize: 16, fontWeight: 700 }}>No {filter} bookings found.</p>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {displayed.map((booking, i) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    onCancel={handleCancel}
                                    index={i}
                                />
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
