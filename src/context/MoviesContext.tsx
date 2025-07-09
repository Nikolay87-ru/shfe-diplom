import React, { createContext, useContext, useEffect, useState } from "react";
import { type Movie } from "../types/Movie";
import { api } from "../utils/api";

interface MoviesContextValue {
  movies: Movie[];
  reload: () => void;
}

const MoviesContext = createContext<MoviesContextValue | undefined>(undefined);

export const MoviesProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const reload = () => {
    api.getMovies().then(setMovies);
  };

  useEffect(reload, []);

  return (
    <MoviesContext.Provider value={{movies, reload}}>
      {children}
    </MoviesContext.Provider>
  )
};

export function useMovies() {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be within MoviesProvider");
  return ctx;
}