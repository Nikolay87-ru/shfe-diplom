import React from "react";
import { type Movie } from "../../types/Movie";

type Props = {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
};

export const MoviesList: React.FC<Props> = ({ movies, onSelect }) => (
  <div className="row">
    {movies.map(movie => (
      <div className="col-md-3 mb-4" key={movie.id}>
        <div className="card h-100" onClick={() => onSelect(movie)} style={{cursor: 'pointer'}}>
          <img src={movie.poster} className="card-img-top" alt={movie.title}/>
          <div className="card-body">
            <h5 className="card-title">{movie.title}</h5>
            <p className="card-text">{movie.description}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);