import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getLocalMovieDetails, getTmdbMovieDetails, addToWatchlist,
    removeFromWatchlist, getWatchlist, getMovieShows, getShowSeats, bookTicket,
    quickReleaseMovie
} from '../services/api';
import {
    Star, Clock, Calendar, Bookmark, Play, CreditCard, CheckCircle,
    ArrowLeft, BookmarkCheck, Ticket, ChevronRight, Film, Tv2, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const seatLabel = (id) => `${String.fromCharCode(65 + Math.floor(id / 10))}${(id % 10) + 1}`;

/* ────────────────────────────────────
   Step Indicator
──────────────────────────────────── */
const StepBar = ({ current }) => (
    <div className="flex items-center mb-8">
        {['Pick Seats', 'Payment'].map((label, i) => {
            const n = i + 2;
            const done = current > n, active = current === n;
            return (
                <React.Fragment key={n}>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div style={{
                            width: 28, height: 28, borderRadius: '50%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900,
                            background: done ? 'var(--success)' : active ? 'var(--primary)' : 'transparent',
                            color: done || active ? 'white' : 'var(--text-muted)',
                            border: done || active ? 'none' : '1.5px solid var(--border)',
                            boxShadow: active ? '0 0 16px rgba(229,9,20,0.35)' : 'none',
                            transition: 'all 0.3s',
                        }}>
                            {done ? <CheckCircle size={13} /> : n - 1}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: active ? 'var(--text)' : 'var(--text-muted)' }}
                            className="hidden sm:block">
                            {label}
                        </span>
                    </div>
                    {i < 1 && (
                        <div style={{ flex: 1, height: 1, margin: '0 12px', background: done ? 'var(--success)' : 'var(--border)', transition: 'all 0.3s' }} />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

/* ────────────────────────────────────
   Main
──────────────────────────────────── */
const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [movie, setMovie]             = useState(null);
    const [movieSource, setMovieSource] = useState('local');
    const [loading, setLoading]         = useState(true);
    const [step, setStep]               = useState(1);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);
    const [shows, setShows]             = useState([]);
    const [selectedShow, setSelectedShow] = useState(null);
    const [seats, setSeats]             = useState([]);
    const [isBooking, setIsBooking]     = useState(false);
    const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
    const [releaseTime, setReleaseTime] = useState('18:00');

    /* Fetch movie */
    useEffect(() => {
        (async () => {
            setLoading(true); setMovie(null);
            try {
                if (parseInt(id) > 100000) {
                    const t = await getTmdbMovieDetails(id);
                    setMovieSource('tmdb'); setMovie(fmt(t.data));
                } else {
                    try {
                        const r = await getLocalMovieDetails(id);
                        setMovieSource('local'); setMovie(r.data);
                        if (user?.id) {
                            const wl = await getWatchlist(user.id).catch(() => ({ data: [] }));
                            setIsInWatchlist(!!wl.data.find(i => i.movie.id === r.data.id));
                        }
                    } catch {
                        const t = await getTmdbMovieDetails(id);
                        setMovieSource('tmdb'); setMovie(fmt(t.data));
                    }
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, [id, user?.id]);

    useEffect(() => {
        if (movieSource === 'local' && movie?.id) {
            getMovieShows(movie.id)
                .then(r => { setShows(r.data); if (r.data.length) setSelectedShow(r.data[0]); })
                .catch(console.error);
        }
    }, [movieSource, movie?.id]);

    useEffect(() => {
        if (selectedShow?.id) getShowSeats(selectedShow.id).then(r => setSeats(r.data)).catch(console.error);
    }, [selectedShow?.id]);

    const fmt = d => ({
        id: d.id, 
        tmdbId: d.id, // For TMDB results, the id IS the tmdbId
        movieName: d.title,
        genre: d.genres?.[0]?.name || 'Unknown',
        rating: d.vote_average?.toFixed(1),
        duration: d.runtime, description: d.overview,
        releaseDate: d.release_date?.substring(0, 4),
        backdropUrl: d.backdrop_path ? `https://image.tmdb.org/t/p/original${d.backdrop_path}` : null,
    });

    const handleWatchlist = async () => {
        if (!isAuthenticated) return navigate('/login');
        setIsWatchlistLoading(true);
        try {
            if (isInWatchlist) { await removeFromWatchlist(user.id, movie.id); setIsInWatchlist(false); }
            else { await addToWatchlist(user.id, movie.id); setIsInWatchlist(true); }
        } catch (e) { console.error(e); }
        finally { setIsWatchlistLoading(false); }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!selectedShow || !selectedSeats.length) return;
        setIsBooking(true);
        try {
            await bookTicket({ userId: user.id, showId: selectedShow.id, bookedSeats: selectedSeats.map(seatLabel).join(',') });
            setStep(4);
        } catch (err) { alert('Booking failed: ' + (err.response?.data?.message || 'Try again.')); }
        finally { setIsBooking(false); }
    };

    const handleQuickRelease = async () => {
        if (!isAuthenticated) return navigate('/login');
        setIsBooking(true);
        try {
            // Use the real TMDB ID for the quick-release operation
            const apiId = movie?.tmdbId || movie?.id || id;
            const res = await quickReleaseMovie(apiId, releaseDate, releaseTime);
            const newShow = res.data;
            setSelectedShow(newShow);
            setStep(2);
        } catch (err) {
            alert('Failed to initialize screening: ' + (err.response?.data?.message || 'Try again.'));
        } finally {
            setIsBooking(false);
        }
    };

    const toggleSeat = id => setSelectedSeats(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
    // Calculate total from actual seat prices returned by the backend
    const total = selectedSeats.reduce((sum, seatId) => {
        const label = seatLabel(seatId);
        const seatData = seats.find(s => s.seatNo === label);
        return sum + (seatData?.price || 300); // fallback to 300 if data not loaded
    }, 0);

    if (loading && step === 1) return (
        <div className="loading-page">
            <div className="spinner" />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 16 }}>Loading movie…</p>
        </div>
    );

    if (!movie && !loading) return (
        <div className="page-body" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', paddingTop: 80 }}>
            <Film size={56} style={{ margin: '0 auto', opacity: 0.1 }} />
            <h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 16 }}>Movie not found</h2>
            <button onClick={() => navigate(-1)} className="btn btn-primary"
                style={{ marginTop: 20, borderRadius: 12, padding: '12px 32px' }}>Go Back</button>
        </div>
    );

    /* ────────────────────────────────────
       STEP 1 — DETAILS PAGE
    ──────────────────────────────────── */
    if (step === 1) return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: 80 }}>

            {/* ══ HERO BACKDROP ══ */}
            <div style={{ position: 'relative', width: '100%', height: 420, overflow: 'hidden' }}>
                {(movie?.backdropUrl || movie?.imgUrl) ? (
                    <img src={movie.backdropUrl || movie.imgUrl} alt=""
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }} />
                ) : (
                    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Film size={80} style={{ opacity: 0.08 }} />
                    </div>
                )}

                {/* Dark vignette — top → bottom */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 100%)',
                }} />

                {/* Back button */}
                <button onClick={() => navigate(-1)} style={{
                    position: 'absolute', top: 24, left: 32, display: 'flex', alignItems: 'center',
                    gap: 6, padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', color: 'white',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>
                    <ArrowLeft size={15} /> Back
                </button>

                {/* Title area */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '0 40px 36px',
                }}>
                    {/* Chips */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                        {movie?.genre && (
                            <span style={{
                                padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 900,
                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                background: 'rgba(229,9,20,0.25)', color: '#ff9999', border: '1px solid rgba(229,9,20,0.3)',
                            }}>{movie.genre}</span>
                        )}
                        {movie?.rating && (
                            <span style={{
                                display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px',
                                borderRadius: 8, fontSize: 11, fontWeight: 900,
                                background: 'rgba(245,197,24,0.2)', color: '#f5c518', border: '1px solid rgba(245,197,24,0.25)',
                            }}>
                                <Star size={11} fill="currentColor" /> {movie.rating}
                            </span>
                        )}
                        <span style={{
                            padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 900,
                            background: shows.length > 0 ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)',
                            color: shows.length > 0 ? '#4ade80' : 'rgba(255,255,255,0.5)',
                            border: `1px solid ${shows.length > 0 ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.1)'}`,
                        }}>
                            {shows.length > 0 ? '● Now Showing' : 'Coming Soon'}
                        </span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900, color: 'white', lineHeight: 1.1, margin: 0, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
                        {movie?.movieName}
                    </h1>
                </div>
            </div>

            {/* ══ HORIZONTAL STATS STRIP ══ */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                borderBottom: '1px solid var(--border)',
                borderTop: '1px solid var(--border)',
                background: 'var(--bg-card)',
            }}>
                {[
                    { label: 'Rating', value: movie?.rating ? `${movie.rating} / 10` : '—', icon: <Star size={16} fill="currentColor" />, color: '#f5c518' },
                    { label: 'Duration', value: movie?.duration ? `${movie.duration} min` : '—', icon: <Clock size={16} />, color: 'var(--primary)' },
                    { label: 'Year', value: movie?.releaseDate || '—', icon: <Calendar size={16} />, color: 'var(--text-secondary)' },
                    { label: 'Genre', value: movie?.genre || '—', icon: <Film size={16} />, color: '#8b5cf6' },
                ].map((s, i) => (
                    <div key={s.label} style={{
                        padding: '20px 24px',
                        borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                        display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: `${s.color === 'var(--primary)' ? 'rgba(229,9,20,0.12)' :
                                s.color === '#f5c518' ? 'rgba(245,197,24,0.12)' :
                                s.color === '#8b5cf6' ? 'rgba(139,92,246,0.12)' :
                                'rgba(138,138,154,0.12)'}`,
                            color: s.color,
                        }}>
                            {s.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', margin: 0 }}>
                                {s.label}
                            </p>
                            <p style={{ fontSize: 15, fontWeight: 800, marginTop: 3, color: 'var(--text)' }}>
                                {s.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ══ BODY ══ */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px 0', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 48 }}>

                {/* LEFT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
                    {/* Overview */}
                    {movie?.description && (
                        <section>
                            <h2 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 3, height: 14, background: 'var(--primary)', borderRadius: 99, display: 'inline-block' }} />
                                Overview
                            </h2>
                            <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>
                                {movie.description}
                            </p>
                        </section>
                    )}

                    {/* Sessions */}
                    {shows.length > 0 ? (
                        <section>
                            <h2 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 3, height: 14, background: 'var(--primary)', borderRadius: 99, display: 'inline-block' }} />
                                Available Sessions
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                                {shows.map(show => {
                                    const active = selectedShow?.id === show.id;
                                    return (
                                        <button key={show.id} onClick={() => setSelectedShow(show)} style={{
                                            padding: '14px 16px', borderRadius: 14, border: `2px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                                            background: active ? 'rgba(229,9,20,0.08)' : 'var(--bg-elevated)',
                                            color: active ? 'var(--primary)' : 'var(--text)',
                                            cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                                            boxShadow: active ? '0 0 0 4px rgba(229,9,20,0.08)' : 'none',
                                        }}>
                                            <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.5, margin: '0 0 4px' }}>
                                                {new Date(show.showDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                                            </p>
                                            <p style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>{show.showTime}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    ) : (
                        <div style={{
                            borderRadius: 16, border: '1.5px dashed var(--border)', padding: '32px 24px',
                            textAlign: 'center', background: 'var(--bg-elevated)',
                        }}>
                            <Tv2 size={28} style={{ margin: '0 auto 10px', opacity: 0.2 }} />
                            <p style={{ fontWeight: 700, margin: '0 0 4px', fontSize: 14 }}>No Screenings Scheduled</p>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                                This title hasn't been scheduled for local screenings yet.
                            </p>
                        </div>
                    )}
                </div>

                {/* RIGHT — Action card */}
                <aside style={{ position: 'relative' }}>
                    <div style={{
                        position: 'sticky', top: 32, borderRadius: 20,
                        border: '1px solid var(--border)',
                        background: 'var(--bg-elevated)',
                        overflow: 'hidden',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                    }}>
                        {/* Header stripe */}
                        <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                            <p style={{ margin: 0, fontWeight: 900, fontSize: 16 }}>{movie?.movieName}</p>
                            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                                {selectedShow
                                    ? `${selectedShow.showDate} · ${selectedShow.showTime}`
                                    : shows.length > 0 ? 'Select a session' : 'Auto-release available'}
                            </p>
                        </div>

                        {/* Buttons & Custom Schedule */}
                        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {shows.length === 0 && (
                                <div style={{ 
                                    marginBottom: 12, padding: '16px', 
                                    background: 'rgba(255,255,255,0.02)', 
                                    borderRadius: 16, border: '1px solid var(--border)',
                                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
                                }}>
                                    <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Calendar size={12} /> Schedule Manually
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <div className="form-group" style={{ margin: 0 }}>
                                            <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>DATE</label>
                                            <input 
                                                type="date" 
                                                value={releaseDate} 
                                                onChange={(e) => setReleaseDate(e.target.value)}
                                                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 10, padding: '8px 10px', fontSize: 12, fontWeight: 700 }}
                                            />
                                        </div>
                                        <div className="form-group" style={{ margin: 0 }}>
                                            <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>TIME</label>
                                            <input 
                                                type="time" 
                                                value={releaseTime} 
                                                onChange={(e) => setReleaseTime(e.target.value)}
                                                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 10, padding: '8px 10px', fontSize: 12, fontWeight: 700 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={shows.length > 0 ? () => { if (!isAuthenticated) return navigate('/login'); setStep(2); } : handleQuickRelease}
                                disabled={isBooking}
                                className="btn btn-primary btn-full"
                                style={{ borderRadius: 14, height: 52, fontSize: 15, fontWeight: 900, boxShadow: '0 8px 24px rgba(229,9,20,0.3)' }}
                            >
                                {isBooking ? <span className="spinner spinner-sm" /> : <Ticket size={18} />}
                                {isBooking ? 'Finalizing...' : shows.length > 0 ? 'Pick Seats & Book' : 'Release & Book Now'}
                            </button>

                            <button
                                onClick={handleWatchlist}
                                disabled={isWatchlistLoading}
                                className="btn btn-ghost btn-full"
                                style={{ 
                                    borderRadius: 14, height: 52, fontSize: 14, fontWeight: 700,
                                    border: '1.5px solid var(--border)',
                                    color: isInWatchlist ? 'var(--primary)' : 'var(--text)',
                                    background: isInWatchlist ? 'rgba(229,9,20,0.05)' : 'transparent',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {isWatchlistLoading ? (
                                    <span className="spinner spinner-sm" />
                                ) : isInWatchlist ? (
                                    <BookmarkCheck size={18} fill="currentColor" />
                                ) : (
                                    <Bookmark size={18} />
                                )}
                                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </motion.div>
    );

    /* ────────────────────────────────────
       STEP 2 — SEAT PICKER
    ──────────────────────────────────── */
    if (step === 2) return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="page-body" style={{ maxWidth: 680, margin: '0 auto', paddingBottom: 80 }}>
            <StepBar current={2} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>Choose Your Seats</h2>
                    {selectedShow && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Calendar size={14} className="text-primary" />
                            {new Date(selectedShow.showDate).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                            <span style={{ width: 4, height: 4, background: 'var(--border)', borderRadius: '50%' }} />
                            <Clock size={14} className="text-secondary" />
                            {selectedShow.showTime}
                        </p>
                    )}
                </div>
                <button onClick={() => setStep(1)} className="btn btn-ghost" style={{ borderRadius: 12, height: 40 }}>
                    <ArrowLeft size={16} /> Change Session
                </button>
            </div>

            {/* Screen */}
            <div style={{ textAlign: 'center', marginBottom: 40, position: 'relative' }}>
                <div style={{ 
                    height: 4, background: 'linear-gradient(to right, transparent, var(--primary), transparent)', 
                    borderRadius: 4, opacity: 0.6, margin: '0 40px 12px',
                    filter: 'blur(2px)'
                }} />
                <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.6em', color: 'var(--text-muted)', textTransform: 'uppercase', marginLeft: '0.6em' }}>Screen</span>
            </div>

            {/* Seat map */}
            <div style={{ 
                borderRadius: 24, border: '1px solid var(--border)', padding: '36px 32px', 
                overflowX: 'auto', background: 'var(--bg-elevated)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 'max-content', margin: '0 auto' }}>
                    {Array.from({ length: 4 }).map((_, row) => (
                        <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                            <span style={{ width: 24, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textAlign: 'center', opacity: 0.5 }}>
                                {String.fromCharCode(65 + row)}
                            </span>
                            {Array.from({ length: 10 }).map((_, col) => {
                                const sid = row * 10 + col;
                                const sNo = `${String.fromCharCode(65 + row)}${col + 1}`;
                                const sv = seats.find(s => s.seatNo === sNo);
                                const taken = sv ? !sv.isAvailable : false;
                                const sel = selectedSeats.includes(sid);
                                const isPremium = row === 0;
                                
                                return (
                                    <motion.button key={sid}
                                        whileTap={!taken ? { scale: 0.85 } : {}}
                                        disabled={taken}
                                        onClick={() => !taken && toggleSeat(sid)}
                                        title={sv ? `${sNo} · $${sv.price}` : sNo}
                                        className={`seat ${sel ? 'seat-selected' : ''} ${taken ? 'seat-taken' : ''} ${isPremium ? 'seat-premium' : ''}`}
                                        style={{
                                            transition: 'all 0.1s',
                                            ...(taken ? { 
                                                background: 'rgba(255,255,255,0.03)', 
                                                borderColor: 'var(--border)', 
                                                color: 'var(--text-muted)',
                                                opacity: 0.3,
                                                cursor: 'not-allowed'
                                            } : {}),
                                            ...(isPremium && !sel && !taken ? { 
                                                background: 'rgba(245,197,24,0.03)', 
                                                borderColor: 'rgba(245,197,24,0.4)', 
                                                color: '#f5c518',
                                                boxShadow: 'inset 0 0 10px rgba(245,197,24,0.05)'
                                            } : {})
                                        }}
                                    >
                                        {col + 1}
                                    </motion.button>
                                );
                            })}
                            <span style={{ width: 24, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textAlign: 'center', opacity: 0.5 }}>
                                {String.fromCharCode(65 + row)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 16 }}>
                {[{ cls: '', label: 'Available' }, { cls: 'seat-premium', label: 'Premium', style: { color: '#f5c518', background: 'rgba(245,197,24,0.1)' } }, { cls: 'seat-selected', label: 'Selected' }, { cls: 'seat-taken', label: 'Taken', style: { background: '#2a1a1a', borderColor: '#4a1a1a' } }].map(({ cls, label, style }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                        <span className={`seat ${cls}`} style={{ width: 18, height: 15, fontSize: 0, cursor: 'default', flexShrink: 0, ...style }} />
                        {label}
                    </div>
                ))}
            </div>

            {/* Footer totals */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                <div>
                    <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: 0 }}>Total</p>
                    <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--gold)', margin: '4px 0 0' }}>${total.toFixed(2)}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>{selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={() => setStep(3)} disabled={!selectedSeats.length}
                    className="btn btn-primary"
                    style={{ borderRadius: 14, padding: '13px 28px', fontWeight: 900, opacity: selectedSeats.length ? 1 : 0.4, boxShadow: '0 6px 20px rgba(229,9,20,0.3)' }}>
                    Continue <ChevronRight size={16} />
                </button>
            </div>
        </motion.div>
    );

    /* ────────────────────────────────────
       STEP 3 — PAYMENT
    ──────────────────────────────────── */
    if (step === 3) return (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="page-body" style={{ maxWidth: 460, margin: '0 auto', paddingBottom: 80 }}>
            <StepBar current={3} />

            {/* Summary */}
            <div style={{ borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 20, background: 'var(--bg-elevated)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                    <div>
                        <p style={{ fontWeight: 900, margin: 0, fontSize: 15 }}>{movie?.movieName}</p>
                        {selectedShow && <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '3px 0 0' }}>{selectedShow.showDate} · {selectedShow.showTime}</p>}
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--gold)' }}>${total.toFixed(2)}</span>
                </div>
                <div style={{ padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedSeats.map(s => <span key={s} className="badge badge-gold">{seatLabel(s)}</span>)}
                </div>
            </div>

            {/* Form */}
            <div style={{ borderRadius: 20, border: '1px solid var(--border)', padding: 24, background: 'var(--bg-elevated)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Lock size={17} style={{ color: 'var(--success)' }} /> Secure Payment
                </h2>
                <form onSubmit={handlePayment}>
                    <div className="form-group" style={{ marginBottom: 14 }}>
                        <label className="form-label">Cardholder Name</label>
                        <input type="text" className="form-input" style={{ borderRadius: 12 }} placeholder="John Smith" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 14 }}>
                        <label className="form-label">Card Number</label>
                        <div className="form-input-icon">
                            <CreditCard size={16} className="input-icon" />
                            <input type="text" className="form-input" style={{ borderRadius: 12 }} placeholder="0000 0000 0000 0000" required />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Expiry <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                            <input type="text" className="form-input" style={{ borderRadius: 12 }} placeholder="MM / YY" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">CVV <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                            <input type="password" className="form-input" style={{ borderRadius: 12 }} placeholder="•••" maxLength={4} />
                        </div>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, opacity: 0.8 }}>
                        <Lock size={11} /> Demo environment — no real charge is made
                    </p>
                    <button type="submit" disabled={isBooking} className="btn btn-primary btn-full"
                        style={{ borderRadius: 14, height: 50, fontSize: 15, fontWeight: 900, boxShadow: '0 6px 20px rgba(229,9,20,0.3)', marginBottom: 10 }}>
                        {isBooking ? <><span className="spinner spinner-sm" /> Processing…</> : <><Ticket size={17} /> Confirm · ${total.toFixed(2)}</>}
                    </button>
                    <button type="button" onClick={() => setStep(2)} className="btn btn-ghost btn-full"
                        style={{ borderRadius: 14, fontSize: 13 }}>← Edit Seats</button>
                </form>
            </div>
        </motion.div>
    );

    /* ────────────────────────────────────
       STEP 4 — SUCCESS
    ──────────────────────────────────── */
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="page-body" style={{ maxWidth: 440, margin: '0 auto', paddingBottom: 80, textAlign: 'center', paddingTop: 40 }}>
            <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
                style={{
                    width: 96, height: 96, borderRadius: '50%', margin: '0 auto 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.3)',
                    boxShadow: '0 0 60px rgba(34,197,94,0.15)',
                }}>
                <CheckCircle size={48} style={{ color: 'var(--success)' }} />
            </motion.div>

            <h2 style={{ fontSize: 30, fontWeight: 900, margin: '0 0 8px' }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 28px' }}>Your tickets are reserved. Enjoy the show! 🎬</p>

            {/* Receipt */}
            <div style={{ borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', textAlign: 'left', marginBottom: 24, background: 'var(--bg-elevated)' }}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
                    <p style={{ fontWeight: 900, margin: 0 }}>{movie?.movieName}</p>
                    {selectedShow && <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{selectedShow.showDate} · {selectedShow.showTime}</p>}
                </div>
                <div style={{ padding: '14px 22px', borderBottom: '1.5px dashed var(--border)' }}>
                    <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: '0 0 8px' }}>Seats</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {selectedSeats.map(s => <span key={s} className="badge badge-gold">{seatLabel(s)}</span>)}
                    </div>
                </div>
                <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Total Paid</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--gold)' }}>${total.toFixed(2)}</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => navigate('/my-bookings')} className="btn btn-primary"
                    style={{ borderRadius: 14, height: 48, fontWeight: 900, boxShadow: '0 6px 20px rgba(229,9,20,0.3)', width: '100%', justifyContent: 'center' }}>
                    <Ticket size={17} /> View My Tickets
                </button>
                <button onClick={() => { setStep(1); setSelectedSeats([]); }} className="btn btn-ghost"
                    style={{ borderRadius: 14, fontSize: 13, width: '100%', justifyContent: 'center' }}>
                    Back to Movie
                </button>
            </div>
        </motion.div>
    );
};

export default MovieDetails;
