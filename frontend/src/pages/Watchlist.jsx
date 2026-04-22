import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Bookmark, Trash2, Calendar, Clock, Star, Film,
    Search, X, Filter, Play, Clapperboard, TrendingUp, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

/* ── helpers ─────────────────────────────────── */
const GENRE_COLORS = {
    ACTION:     { bg: 'rgba(239,68,68,0.12)',   text: '#f87171', border: 'rgba(239,68,68,0.25)' },
    COMEDY:     { bg: 'rgba(234,179,8,0.12)',   text: '#fbbf24', border: 'rgba(234,179,8,0.25)' },
    DRAMA:      { bg: 'rgba(99,102,241,0.12)',  text: '#a78bfa', border: 'rgba(99,102,241,0.25)' },
    THRILLER:   { bg: 'rgba(249,115,22,0.12)',  text: '#fb923c', border: 'rgba(249,115,22,0.25)' },
    ROMANTIC:   { bg: 'rgba(236,72,153,0.12)',  text: '#f472b6', border: 'rgba(236,72,153,0.25)' },
    HORROR:     { bg: 'rgba(107,114,128,0.12)', text: '#9ca3af', border: 'rgba(107,114,128,0.25)' },
    ANIMATION:  { bg: 'rgba(34,197,94,0.12)',   text: '#4ade80', border: 'rgba(34,197,94,0.25)' },
    HISTORICAL: { bg: 'rgba(180,83,9,0.12)',    text: '#d97706', border: 'rgba(180,83,9,0.25)' },
    _DEFAULT:   { bg: 'rgba(255,255,255,0.06)', text: '#9ca3af', border: 'rgba(255,255,255,0.1)' },
};
const gs = (genre) => GENRE_COLORS[(genre || '').toUpperCase()] || GENRE_COLORS._DEFAULT;

const year = (v) => {
    if (!v) return '—';
    if (typeof v === 'string') return v.substring(0, 4);
    if (Array.isArray(v)) return String(v[0]);
    return String(v).substring(0, 4);
};

/* ── Row card (horizontal) ───────────────────── */
const WatchlistRow = ({ item, onRemove, index }) => {
    const [removing, setRemoving] = useState(false);
    const navigate = useNavigate();
    const movie = item?.movie || {};
    const style = gs(movie.genre);

    const handleRemove = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!movie.id) return;
        setRemoving(true);
        await onRemove(movie.id);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            onClick={() => navigate(`/movies/${movie.id}`)}
            style={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr 120px 80px 64px 100px 100px',
                alignItems: 'center',
                gap: 0,
                padding: '0 20px',
                minHeight: 72,
                cursor: 'pointer',
                borderBottom: '1px solid var(--border)',
                background: 'transparent',
                transition: 'background 0.15s',
            }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
        >
            {/* Rank / Index */}
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', paddingRight: 8 }}>
                {String(index + 1).padStart(2, '0')}
            </div>

            {/* Title + thumbnail */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, overflow: 'hidden' }}>
                {/* Tiny poster */}
                <div style={{
                    width: 36, height: 52, borderRadius: 6, overflow: 'hidden',
                    flexShrink: 0, background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                }}>
                    {movie.imgUrl
                        ? <img src={movie.imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <Film size={16} style={{ margin: '18px auto', opacity: 0.2, display: 'block' }} />}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <p style={{
                        fontSize: 14, fontWeight: 700, color: 'var(--text)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        {movie.movieName}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                        <span style={{
                            fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6,
                            border: `1px solid ${style.border}`,
                            background: style.bg, color: style.text,
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}>
                            {movie.genre || 'Unknown'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {movie.rating ? (
                    <>
                        <Star size={13} fill="#f5c518" style={{ color: '#f5c518', flexShrink: 0 }} />
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>
                            {Number(movie.rating).toFixed(1)}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/10</span>
                    </>
                ) : (
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>—</span>
                )}
            </div>

            {/* Year */}
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Calendar size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                {year(movie.releaseDate)}
            </div>

            {/* Duration */}
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                {movie.duration ? (
                    <>
                        <Clock size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        {movie.duration}m
                    </>
                ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                )}
            </div>

            {/* View */}
            <Link
                to={`/movies/${movie.id}`}
                onClick={e => e.stopPropagation()}
                style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    padding: '7px 12px', borderRadius: 10,
                    border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                    fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-subtle)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
            >
                <Play size={12} fill="currentColor" /> View
            </Link>

            {/* Remove */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={handleRemove}
                    disabled={removing}
                    title="Remove"
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 34, height: 34, borderRadius: 8,
                        border: '1px solid var(--border)', background: 'transparent',
                        color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                    {removing
                        ? <div className="spinner spinner-sm" style={{ width: 14, height: 14 }} />
                        : <Trash2 size={14} />}
                </motion.button>
            </div>
        </motion.div>
    );
};

/* ── Main Page ───────────────────────────────── */
const Watchlist = () => {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch]       = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [sortBy, setSortBy]       = useState('default'); // 'default' | 'rating' | 'year' | 'name'

    useEffect(() => { fetchWatchlist(); }, [user?.id]);

    const fetchWatchlist = async () => {
        if (!user?.id) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const res = await api.get(`/watchlist/user/${user.id}`);
            setWatchlist(res.data);
        } catch (err) {
            console.error('Error fetching watchlist:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (movieId) => {
        try {
            await api.delete(`/watchlist/${user.id}/${movieId}`);
            setWatchlist(prev => prev.filter(i => i.movie.id !== movieId));
        } catch (err) {
            console.error('Error removing:', err);
        }
    };

    /* Derived data */
    const safeWatchlist = Array.isArray(watchlist) ? watchlist : [];

    const genres = useMemo(() => {
        const all = safeWatchlist.map(i => i.movie?.genre).filter(Boolean);
        return ['All', ...Array.from(new Set(all))];
    }, [safeWatchlist]);

    const avgRating = useMemo(() => {
        const rated = safeWatchlist.filter(i => i.movie?.rating);
        if (!rated.length) return null;
        return (rated.reduce((s, i) => s + Number(i.movie.rating), 0) / rated.length).toFixed(1);
    }, [safeWatchlist]);

    const totalMinutes = useMemo(() => {
        return safeWatchlist.reduce((s, i) => s + (i.movie?.duration || 0), 0);
    }, [safeWatchlist]);

    const filtered = useMemo(() => {
        let list = safeWatchlist.filter(item => {
            const q = search.toLowerCase();
            const movieName = item.movie?.movieName || '';
            const matchSearch = !search || movieName.toLowerCase().includes(q);
            const matchGenre  = selectedGenre === 'All' || item.movie?.genre === selectedGenre;
            return matchSearch && matchGenre;
        });
        if (sortBy === 'rating') list = [...list].sort((a, b) => Number(b.movie?.rating || 0) - Number(a.movie?.rating || 0));
        else if (sortBy === 'year') list = [...list].sort((a, b) => year(b.movie?.releaseDate).localeCompare(year(a.movie?.releaseDate)));
        else if (sortBy === 'name') list = [...list].sort((a, b) => (a.movie?.movieName || '').localeCompare(b.movie?.movieName || ''));
        return list;
    }, [safeWatchlist, search, selectedGenre, sortBy]);

    /* ── loading ─── */
    if (isLoading) return (
        <div className="loading-page">
            <div className="spinner" />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 16 }}>Loading your watchlist…</p>
        </div>
    );

    /* ── empty ─── */
    if (!watchlist.length) return (
        <div className="page-body" style={{ maxWidth: 560, margin: '80px auto 0', textAlign: 'center', paddingTop: 40 }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{
                    width: 100, height: 100, borderRadius: '50%',
                    background: 'var(--bg-elevated)', border: '1.5px dashed var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                }}>
                    <Bookmark size={40} style={{ opacity: 0.15 }} />
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 10 }}>Your Watchlist is Empty</h1>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 28, fontSize: 15 }}>
                    Browse the catalog and save films you want to watch to your personal list.
                </p>
                <Link to="/" className="btn btn-primary" style={{ borderRadius: 14, padding: '13px 32px', fontWeight: 900, boxShadow: '0 6px 24px rgba(229,9,20,0.3)' }}>
                    <Film size={17} /> Browse Films
                </Link>
            </motion.div>
        </div>
    );

    /* ── main ─── */
    return (
        <div style={{ paddingBottom: 80 }}>

            {/* ══ PAGE HEADER ══ */}
            <div style={{ padding: '36px 48px 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: 'var(--primary-subtle)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Bookmark size={20} style={{ color: 'var(--primary)' }} fill="currentColor" />
                            </div>
                            <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.5px' }}>My Watchlist</h1>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                            {watchlist.length} {watchlist.length === 1 ? 'film' : 'films'} saved to your list
                        </p>
                    </div>
                </div>
            </div>

            {/* ══ STAT STRIP ══ */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                margin: '28px 48px 0',
                borderRadius: 16, overflow: 'hidden',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
            }}>
                {[
                    { label: 'Saved', value: watchlist.length, icon: <Bookmark size={16} />, color: 'var(--primary)' },
                    { label: 'Avg. Rating', value: avgRating ? `${avgRating}★` : '—', icon: <Star size={16} />, color: '#f5c518' },
                    { label: 'Total Time', value: totalMinutes >= 60 ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m` : `${totalMinutes}m`, icon: <Clock size={16} />, color: 'var(--success)' },
                    { label: 'Genres', value: genres.length - 1, icon: <Clapperboard size={16} />, color: '#8b5cf6' },
                ].map((s, i) => (
                    <div key={s.label} style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '18px 22px',
                        borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                    }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: s.color,
                            background: s.color === 'var(--primary)' ? 'rgba(229,9,20,0.12)'
                                : s.color === '#f5c518' ? 'rgba(245,197,24,0.12)'
                                : s.color === 'var(--success)' ? 'rgba(34,197,94,0.12)'
                                : 'rgba(139,92,246,0.12)',
                        }}>
                            {s.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: 0 }}>{s.label}</p>
                            <p style={{ fontSize: 20, fontWeight: 900, margin: '2px 0 0', color: 'var(--text)' }}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ══ TOOLBAR ══ */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '20px 48px',
                flexWrap: 'wrap',
            }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: '1', minWidth: 180, maxWidth: 300 }}>
                    <Search size={14} style={{
                        position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--text-muted)', pointerEvents: 'none',
                    }} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search your list…"
                        className="form-input"
                        style={{ paddingLeft: 38, paddingRight: search ? 34 : 14, height: 40, fontSize: 13, borderRadius: 12 }}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} style={{
                            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex',
                        }}>
                            <X size={13} />
                        </button>
                    )}
                </div>

                {/* Genre pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {genres.map(g => {
                        const s = g !== 'All' ? gs(g) : null;
                        const active = selectedGenre === g;
                        return (
                            <button key={g} onClick={() => setSelectedGenre(g)} style={{
                                padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                                cursor: 'pointer', transition: 'all 0.15s',
                                border: `1.5px solid ${active ? (s?.border || 'var(--primary)') : 'var(--border)'}`,
                                background: active ? (s?.bg || 'var(--primary-subtle)') : 'transparent',
                                color: active ? (s?.text || 'var(--primary)') : 'var(--text-secondary)',
                            }}>
                                {g}
                            </button>
                        );
                    })}
                </div>

                {/* Sort */}
                <div style={{
                    marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 6px 6px 12px', borderRadius: 12,
                    border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                    fontSize: 12, color: 'var(--text-secondary)',
                }}>
                    <TrendingUp size={13} />
                    <span style={{ fontWeight: 600 }}>Sort:</span>
                    {[{ v: 'default', l: 'Added' }, { v: 'rating', l: 'Rating' }, { v: 'year', l: 'Year' }, { v: 'name', l: 'Name' }].map(o => (
                        <button key={o.v} onClick={() => setSortBy(o.v)} style={{
                            padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
                            background: sortBy === o.v ? 'var(--primary)' : 'transparent',
                            color: sortBy === o.v ? 'white' : 'var(--text-secondary)',
                        }}>
                            {o.l}
                        </button>
                    ))}
                </div>
            </div>

            {/* ══ TABLE ══ */}
            <div style={{ margin: '0 48px' }}>
                {/* Column headers */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr 120px 80px 64px 100px 100px',
                    alignItems: 'center',
                    padding: '0 20px',
                    height: 40,
                    borderRadius: '12px 12px 0 0',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderBottom: 'none',
                }}>
                    {['#', 'Title', 'Rating', 'Year', 'Length', 'Details', ''].map((col, i) => (
                        <div key={i} style={{
                            fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                            letterSpacing: '0.09em', color: 'var(--text-muted)',
                            textAlign: i >= 5 ? 'center' : 'left',
                        }}>
                            {col}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                <div style={{
                    borderRadius: '0 0 12px 12px',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    background: 'var(--bg-card)',
                }}>
                    <AnimatePresence>
                        {filtered.length > 0 ? (
                            filtered.map((item, i) => (
                                <WatchlistRow key={item.id} item={item} onRemove={handleRemove} index={i} />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ padding: '60px 20px', textAlign: 'center' }}
                            >
                                <Search size={32} style={{ margin: '0 auto 12px', opacity: 0.15 }} />
                                <p style={{ fontWeight: 700, marginBottom: 4 }}>No results found</p>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Try adjusting your search or filters.</p>
                                <button onClick={() => { setSearch(''); setSelectedGenre('All'); }}
                                    style={{
                                        marginTop: 16, padding: '8px 20px', borderRadius: 10, cursor: 'pointer',
                                        background: 'transparent', border: '1px solid var(--border)',
                                        color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
                                    }}>
                                    Clear Filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Row count */}
                {(search || selectedGenre !== 'All') && filtered.length > 0 && (
                    <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
                        Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> of {watchlist.length} films
                    </p>
                )}
            </div>
        </div>
    );
};

export default Watchlist;
