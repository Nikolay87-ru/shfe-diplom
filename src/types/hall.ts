export interface Hall {
  id: number;
  hall_name: string;
  hall_open: number;
  hall_rows: number;
  hall_places: number;
  hall_config: Seat[][];
}

export interface Seat {
  type: 'standart' | 'vip' | 'blocked';
  price: number;
  selected?: boolean;
  occupied?: boolean;
}