import {CinemaHall} from "../CinemaHall/CinemaHall.tsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useCinemaContext} from "../../context/CinemaContext.tsx";
import {USER_PAGES} from "../../router.tsx";
import {FilmData, HallData, SeanceData, Seat, SeatType} from "../../types.tsx";
import {useEffect, useState} from "react";
import {BackendApi} from "../../BackendApi.tsx";
import "./Seance.css"

export const Seance = () => {
    const {halls, films, seances} = useCinemaContext();
    const [selectedHall, setSelectedHall] = useState<HallData | undefined>()
    const [selectedFilm, setSelectedFilm] = useState<FilmData | undefined>()
    const [selectedSeance, setSelectedSeance] = useState<SeanceData | undefined>()
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [seats, setSeats] = useState<(Seat | null)[][]>([])
    const {id} = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date');
    const navigate = useNavigate();
    const backendApi = BackendApi.getInstance()

    useEffect(() => {
        async function fetchData() {
            if (!id || !date) {
                return;
            }
            const seanceId = Number(id);

            const seance = seances.find(seance => seance.id === seanceId);
            const hall = halls.find(hall => seance?.seance_hallid === hall.id);
            const film = films.find(film => seance?.seance_filmid === film.id);

            const response = await backendApi.getHallConfig(seanceId, date)
            const seatsForDate = generateSeats(response)
            setSelectedHall(hall)
            setSelectedFilm(film)
            setSelectedSeance(seance)
            setSeats(seatsForDate)
        }

        fetchData()
    }, []);

    const generateSeats = (hallConfig: SeatType[][] = []) => {
        let count = 1
        return hallConfig.map((row, rowIndex) =>
            row.map((seatType, seatIndex) => {
                if (seatType === "disabled") return null;
                const seat: Seat = {
                    id: count++,
                    row: rowIndex + 1,
                    number: seatIndex + 1,
                    type: seatType,
                };
                return seat;
            })
        );
    };

    const handleBooking = () => {
        if (!selectedHall || !selectedSeance || !selectedFilm) return;

        const totalPrice = selectedSeats.reduce((acc, seat) => {
            const price = seat.type === "vip"
                ? selectedHall.hall_price_vip || 0
                : selectedHall.hall_price_standart || 0;
            return acc + price;
        }, 0);

        const bookingData = {
            seanceId: selectedSeance.id,
            seanceDate: date,
            film: selectedFilm.film_name,
            seats: selectedSeats,
            hall: selectedHall.hall_name,
            time: selectedSeance.seance_time,
            vipPrice: selectedHall.hall_price_vip,
            standartPrice: selectedHall.hall_price_standart,
            totalPrice
        };

        navigate(USER_PAGES.PAYMENT, {
            state: {bookingData}
        });
    };

    return (
        <div className="booking_main">
            <div className="booking_header">
                <div className="bolder_text">{selectedFilm?.film_name}</div>
                <div className="tiny_text">Начало сеанса: {selectedSeance?.seance_time}</div>
                <div className="bolder_text">{selectedHall?.hall_name}</div>
            </div>
            {seats.length > 0 ?
                <CinemaHall
                    seats={seats}
                    prices={{
                        standart: selectedHall?.hall_price_standart,
                        vip: selectedHall?.hall_price_vip,
                    }}
                    onSeatSelect={setSelectedSeats}
                /> : <></>
            }
            <button className="booking_button"
                    onClick={handleBooking}
                    disabled={selectedSeats.length === 0}>
                ЗАБРОНИРОВАТЬ
            </button>
        </div>
    );
};