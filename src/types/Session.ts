export interface Session {
  id: number;
  movieId: number;
  hallId: number;
  date: string; 
  time: string; 
  price: number;
  seats: boolean[][];
}