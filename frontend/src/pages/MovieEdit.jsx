import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLocalMovies, updateMovie } from '../services/api';
import MovieForm from '../components/MovieForm';
import { ArrowLeft, Edit3 } from 'lucide-react';

const MovieEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await getLocalMovies();
        const found = response.data.find(m => m.id.toString() === id);
        setMovie(found);
      } catch (err) {
        setError('Could not load movie details.');
      }
    };
    fetchMovie();
  }, [id]);

  const handleSubmit = async (movieData) => {
    setLoading(true);
    setError('');
    try {
      await updateMovie(id, movieData);
      navigate('/admin');
    } catch (err) {
      setError('Failed to update movie.');
    } finally {
      setLoading(false);
    }
  };

  if (!movie && !error) return <div className="text-center p-20 animate-pulse">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="flex items-center gap-4">
        <Link to="/admin" className="p-2 glass rounded-full hover:bg-glass-border">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3">
          <Edit3 className="text-accent" />
          <h1 className="text-3xl font-bold">Edit Movie: <span className="text-accent">{movie?.movieName}</span></h1>
        </div>
      </div>

      {error && <div className="bg-error/10 text-error p-4 rounded-lg">{error}</div>}

      <div className="glass p-10">
        <MovieForm initialData={movie} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default MovieEdit;
