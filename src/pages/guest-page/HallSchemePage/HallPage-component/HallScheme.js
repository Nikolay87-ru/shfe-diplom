import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../../utils/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HallScheme.scss';
export const HallScheme = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState(null);
    const [hall, setHall] = useState(null);
    const [seance, setSeance] = useState(null);
    const [rows, setRows] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await api.getAllData();
                const currentSeance = data.result?.seances?.find((s) => s.id === Number(id));
                if (!currentSeance) {
                    navigate('/');
                    return;
                }
                const film = data.result?.films?.find((f) => f.id === currentSeance.seance_filmid);
                const hallData = data.result?.halls?.find((h) => h.id === currentSeance.seance_hallid);
                setMovie(film || null);
                setHall(hallData || null);
                setSeance(currentSeance);
                if (hallData) {
                    const hallConfigResponse = await api.getHallConfig(currentSeance.id.toString(), new Date().toISOString().split('T')[0]);
                    let configToUse = hallData.hall_config;
                    if (hallConfigResponse.success && Array.isArray(hallConfigResponse.result)) {
                        configToUse = hallConfigResponse.result;
                    }
                    else if (!hallConfigResponse.success) {
                        console.error('Failed to get hall config:', hallConfigResponse.error);
                    }
                    const rowsData = configToUse.map((row) => ({
                        seats: row.map((seatType) => {
                            const type = seatType;
                            return {
                                type,
                                selected: false,
                                occupied: type === 'disabled' || type === 'taken',
                            };
                        }),
                    }));
                    setRows(rowsData);
                }
            }
            catch (error) {
                console.error('Error fetching data:', error);
                navigate('/');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);
    const handleSeatSelect = (rowIndex, seatIndex) => {
        if (rows[rowIndex]?.seats[seatIndex]?.occupied)
            return;
        setSelectedSeats((prev) => {
            const existingIndex = prev.findIndex(([r, s]) => r === rowIndex && s === seatIndex);
            if (existingIndex >= 0) {
                return prev.filter((_, i) => i !== existingIndex);
            }
            else {
                return [...prev, [rowIndex, seatIndex]];
            }
        });
        setRows((prev) => {
            const newRows = [...prev];
            const seat = newRows[rowIndex].seats[seatIndex];
            newRows[rowIndex].seats[seatIndex] = {
                ...seat,
                selected: !seat.selected,
            };
            return newRows;
        });
    };
    async function handleBuy() {
        if (selectedSeats.length === 0) {
            toast.info('Выберите хотя бы одно место!', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        try {
            if (!hall || !seance)
                return;
            const tickets = selectedSeats.map(([row, seat]) => ({
                row: row + 1,
                place: seat + 1,
                coast: rows[row].seats[seat].type === 'vip' ? hall.hall_price_vip : hall.hall_price_standart,
            }));
            localStorage.setItem('tickets', JSON.stringify(tickets));
            localStorage.setItem('seanceId', id || '');
            localStorage.setItem('movie', JSON.stringify(movie));
            localStorage.setItem('hall', JSON.stringify(hall));
            localStorage.setItem('seance', JSON.stringify(seance));
            navigate(`/ticket/${id}`);
        }
        catch (error) {
            console.error('Error booking seats:', error);
            toast.error(error instanceof Error ? error.message : 'Произошла ошибка при бронировании мест', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }
    if (loading) {
        return _jsx("div", { className: "loading", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    }
    if (!movie || !hall || !seance) {
        return null;
    }
    return (_jsxs("div", { className: "hall-scheme", children: [_jsx("div", { className: "screen" }), _jsx("div", { className: "rows", children: rows.map((row, rowIndex) => (_jsx("div", { className: "row", children: row.seats.map((seat, seatIndex) => (_jsx("button", { className: `seat ${seat.type} ${seat.selected ? 'selected' : ''} ${seat.occupied ? 'occupied' : ''}`, onClick: () => handleSeatSelect(rowIndex, seatIndex), disabled: seat.occupied || seat.type === 'disabled' }, seatIndex))) }, rowIndex))) }), _jsxs("div", { className: "legend", children: [_jsxs("div", { className: "legend-item", children: [_jsx("div", { className: "seat standart" }), _jsxs("span", { children: ["\u041E\u0431\u044B\u0447\u043D\u044B\u0435 (", hall.hall_price_standart, " \u0440\u0443\u0431)"] })] }), _jsxs("div", { className: "legend-item", children: [_jsx("div", { className: "seat vip" }), _jsxs("span", { children: ["VIP (", hall.hall_price_vip, " \u0440\u0443\u0431)"] })] }), _jsxs("div", { className: "legend-item", children: [_jsx("div", { className: "seat occupied" }), _jsx("span", { children: "\u0417\u0430\u043D\u044F\u0442\u043E" })] }), _jsxs("div", { className: "legend-item", children: [_jsx("div", { className: "seat selected" }), _jsx("span", { children: "\u0412\u044B\u0431\u0440\u0430\u043D\u043E" })] })] }), _jsx("div", { className: "container-button", children: _jsxs("button", { className: "buy-button", onClick: handleBuy, children: ["\u0417\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C (", selectedSeats.length, ")"] }) })] }));
};
