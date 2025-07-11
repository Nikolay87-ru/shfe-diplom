// import React from "react";
// import { type Movie } from "../../../types/Movie";

// type Props = {
//   movies: Movie[];
//   onDelete?: (id: number) => void;
//   onEdit?: (movie: Movie) => void;
// };

// export const MoviesTable: React.FC<Props> = ({ movies, onDelete, onEdit }) => (
//   <table className="table">
//     <thead>
//       <tr>
//         <th>ID</th><th>Название</th><th>Длительность</th><th></th>
//       </tr>
//     </thead>
//     <tbody>
//       {movies.map(m => (
//         <tr key={m.id}>
//           <td>{m.id}</td>
//           <td>{m.title}</td>
//           <td>{m.duration} мин</td>
//           <td>
//             {onEdit && <button className='btn btn-sm btn-primary me-2' onClick={() => onEdit(m)}>Редактировать</button>}
//             {onDelete && <button className='btn btn-sm btn-danger' onClick={() => onDelete(m.id)}>Удалить</button>}
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// );