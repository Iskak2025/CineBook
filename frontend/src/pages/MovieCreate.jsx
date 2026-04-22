import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMovie } from '../services/api';
import MovieForm from '../components/MovieForm';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const MovieCreate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (movieData) => {
        setLoading(true);
        setError('');
        try {
            await addMovie(movieData);
            navigate('/admin');
        } catch (err) {
            setError('Failed to add movie. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-700">
            <div className="flex items-center gap-4">
                <Link to="/admin" className="p-2 glass rounded-full hover:bg-glass-border">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-bold">Add New Movie</h1>
            </div>

            {error && <div className="bg-error/10 text-error p-4 rounded-lg">{error}</div>}

            <div className="glass p-10">
                <MovieForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
};

export default MovieCreate;
