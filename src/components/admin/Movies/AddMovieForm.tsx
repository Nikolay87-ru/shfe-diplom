// import React, { useState } from 'react';
// import { type Movie } from '../../../types/Movie';

// type Props = {
//   onAdd: (movie: Omit<Movie, 'id'>) => void;
// };

// export const AddMovieForm: React.FC<Props> = ({ onAdd }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [duration, setDuration] = useState(90);
//   const [poster, setPoster] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onAdd({ title, description, duration, poster });
//     setTitle(''); setDescription(''); setDuration(90); setPoster('');
//   };
//   return (
//     <form onSubmit={handleSubmit} className="mb-3">
//       <div className="mb-2"><input className="form-control" type="text" placeholder="Название" required value={title} onChange={e => setTitle(e.target.value)}/></div>
//       <div className="mb-2"><input className="form-control" type="text" placeholder="Описание" required value={description} onChange={e => setDescription(e.target.value)}/></div>
//       <div className="mb-2"><input className="form-control" type="number" min={30} max={300} placeholder="Длительность" required value={duration} onChange={e => setDuration(Number(e.target.value))}/></div>
//       <div className="mb-2"><input className="form-control" type="url" placeholder="Постер (URL)" required value={poster} onChange={e => setPoster(e.target.value)}/></div>
//       <button className="btn btn-success">Добавить фильм</button>
//     </form>
//   );
// };