import React from 'react';
import { type Movie } from '../../types/movie';

interface Props {
  movie: Movie;
  selectedDate: Date;
}

const MovieCard = ({ movie, selectedDate }: Props) => (
  <div className="movie">
    <div className="movie__info">
      <div className="movie__poster">
        <img className="movie__poster_image" src={movie.poster_url || ''} alt={movie.title} />
      </div>
      <div className="movie__description">
        <div className="movie__title">{movie.title}</div>
        <div className="movie__synopsis">{movie.synopsis}</div>
        <div className="movie__data">
          <span className="movie__data-length">{movie.length} мин.</span>
          <span className="movie__data-country">{movie.country}</span>
        </div>
      </div>
    </div>
  </div>
);

export default MovieCard;