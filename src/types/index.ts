export interface Film {
  id: number;
  film_name: string;
  film_description: string;
  film_duration: number;
  film_origin: string;
  film_poster: string;
}

export interface Hall {
  id: number;
  hall_name: string;
  hall_open: 0 | 1;
  hall_rows: number;
  hall_places: number;
  hall_price_standart: number;
  hall_price_vip: number;
  hall_config: string[][];
}

export interface Seance {
  id: number;
  seance_filmid: number;
  seance_hallid: number;
  seance_time: string;
}

export interface AllData {
  films: Film[];
  halls: Hall[];
  seances: Seance[];
}