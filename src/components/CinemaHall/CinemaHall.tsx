import {useState} from "react";
import "./CinemaHall.css"
import {Seat} from "../../types.tsx";

interface CinemaHallProps {
    seats: (Seat | null)[][];
    prices: {
        standart: number | undefined;
        vip: number | undefined;
    };
    onSeatSelect: (selectedSeats: Seat[]) => void;
}

export const CinemaHall = ({seats, prices, onSeatSelect}: CinemaHallProps) => {
    const [seatsState, setSeatsState] = useState<(Seat | null)[][]>(seats);

    const handleSeatClick = (rowIndex: number, seatIndex: number) => {
        const seat = seatsState[rowIndex][seatIndex];
        if (!seat || ["taken", "disabled"].includes(seat.type)) return;

        const newSeats = seatsState.map(row =>
            row.map(s => {
                if (s?.id === seat.id) {
                    return {...s, isSelected: !s.isSelected};
                }
                return s;
            })
        );

        setSeatsState(newSeats);
        onSeatSelect(newSeats.flat().filter(s => s?.isSelected) as Seat[]);
    };

    return (
        <div className="cinema_hall_main">
            <div className="cinema_hall_seats_main">
                {seatsState.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="cinema_hall_seat_row">
                        {row.map((seat, seatIndex) =>
                            seat ? (
                                <button
                                    key={seat.id}
                                    className={`cinema_hall_seat ${seat.type} ${
                                        seat.isSelected ? "selected" : ""
                                    }`}
                                    onClick={() => handleSeatClick(rowIndex, seatIndex)}
                                    disabled={["taken", "disabled"].includes(seat.type)}
                                />
                            ) : (
                                <div key={`gap-${seatIndex}`} className="cinema_hall_seat_gap"/>
                            )
                        )}
                    </div>
                ))}
            </div>
            <div className="cinema_hall_legend">
                <div>
                    <div className="cinema_hall_col col1">
                        <div className="cinema_hall_legend_price">
                            <div className="cinema_hall_legend_chair" style={{background: "#ffffff"}}></div>
                            <div className="tiny_text white no_wrap">Свободно ({prices.standart}руб)</div>
                        </div>
                        <div className="cinema_hall_legend_price">
                            <div className="cinema_hall_legend_chair" style={{background: "#F9953A"}}></div>
                            <div className="tiny_text white no_wrap">Свободно VIP ({prices.vip}руб)</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="cinema_hall_col col2">
                        <div className="cinema_hall_legend_price">
                            <div className="cinema_hall_legend_chair" style={{background: "#171D24"}}></div>
                            <div className="tiny_text white no_wrap">Занято</div>
                        </div>
                        <div className="cinema_hall_legend_price">
                            <div className="cinema_hall_legend_chair" style={{background: "#25C4CE"}}></div>
                            <div className="tiny_text white no_wrap">Выбрано</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
