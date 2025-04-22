import {useState} from "react";
import {HallData, SeatType} from "../../types.tsx";
import {useCinemaContext} from "../../context/CinemaContext.tsx";
import {CommonButton} from "../CommonButton/CommonButton.tsx";
import {HallListButtons} from "../HallListButtons/HallListButtons.tsx";
import {Chair} from "../AdminDashboard/Chair.tsx";
import "./HallConfigMain.css"
import {BackendApi} from "../BackendApi.tsx";

const seatOrder: SeatType[] = ["standart", "vip", "disabled"];

export const HallConfigMain = () => {
    const {halls, updateHall} = useCinemaContext();
    const [rows, setRows] = useState<number | undefined>(halls[0].hall_rows);
    const [seats, setSeats] = useState<number | undefined>(halls[0].hall_places);
    const [selectedHall, setSelectedHall] = useState<HallData | undefined>(halls[0]);
    const [seatsGrid, setSeatsGrid] = useState<SeatType[][] | undefined>(halls[0].hall_config);
    const backendApi = BackendApi.getInstance();

    const handleSelectHall = (hallId: number) => {
        const hall = halls.find(hall => hall.id === hallId)
        if (!hall) {
            return;
        }
        setRows(hall.hall_rows)
        setSeats(hall.hall_places);
        setSeatsGrid(hall.hall_config);
        setSelectedHall(hall);
    }

    const handleRowsChange = (e: any) => {
        const value = Math.max(1, Math.min(10, e.target.value));
        setRows(value);
        generateSeatsGrid(value, seats ? seats : 1);
    };

    const handleSeatsChange = (e: any) => {
        const value = Math.max(1, Math.min(10, e.target.value));
        setSeats(value);
        generateSeatsGrid(rows ? rows : 1, value);
    };

    const generateSeatsGrid = (rows: number, seats: number) => {
        const newGrid = Array.from({length: rows}, () => Array(seats).fill('standart'));
        setSeatsGrid(newGrid);
    };

    const handleCancel = () => {
        setRows(selectedHall?.hall_rows)
        setSeats(selectedHall?.hall_places);
        setSeatsGrid(selectedHall?.hall_config)
    }

    const handleSaveHallConfig = async () => {
        if (!selectedHall || !rows || !seats || !seatsGrid) {
            return;
        }
        const response = await backendApi.saveHallConfig(selectedHall.id, rows, seats, seatsGrid)
        try {
            updateHall(response);
            setSelectedHall(response);
        } catch (error) {
            console.error('Ошибка при сохранении конфигурации зала:', error);
        }
    };


    const handleSeatClick = (row: number, seat: number) => {
        if (seatsGrid) {
            const currentSeatType = seatsGrid[row][seat];
            const currentIndex = seatOrder.indexOf(currentSeatType);
            const nextIndex = (currentIndex + 1) % seatOrder.length;
            const nextSeatType = seatOrder[nextIndex];
            const newSeatsGrid = [...seatsGrid];
            newSeatsGrid[row] = [...newSeatsGrid[row]];
            newSeatsGrid[row][seat] = nextSeatType;
            setSeatsGrid(newSeatsGrid);
        }
    };

    return (
        <div className={"hall_config_main"}>
            <div className={"hcm_halls_list"}>
                <div className={"hcm_halls_list_title"}>Выберите зал для конфигурации:</div>
                <HallListButtons halls={halls} onSelectHall={handleSelectHall} selectedHall={selectedHall}/>
            </div>
                <div className={"hall_config_inputs_box"}>
                    <div className={"hcm_halls_list_title"}>Укажите количество рядов и максимальное количество кресел в
                        ряду:
                    </div>
                    <form className={"hcm_size_inputs"}>
                        <div>
                            <div className={"hcm_size_inputs_title"}>Рядов, шт</div>
                            <input
                                className={"hcm_size_input"}
                                type="number"
                                min={1}
                                max={10}
                                value={rows}
                                onChange={handleRowsChange}
                            />
                        </div>
                        <div className={"hcm_size_input_x"}>X</div>
                        <div>
                            <div className={"hcm_size_inputs_title"}>Мест, шт</div>
                            <input
                                className={"hcm_size_input"}
                                type="number"
                                min={1}
                                max={10}
                                value={seats}
                                onChange={handleSeatsChange}
                            />
                        </div>
                    </form>
                </div>
                <div className={"hcm_hall_scheme_main"}>
                    <div className={"hcm_hall_scheme_main_title"}>
                        Теперь вы можете указать типы кресел на схеме зала:
                    </div>
                    <div className={"hcm_hall_scheme_legend"}>
                        <div className={"hcm_hall_scheme_legend_item"}>
                            <Chair type={"standart"}/>
                            <div className={"hcm_hall_scheme_chair_title"}>— обычные кресла</div>
                        </div>
                        <div className={"hcm_hall_scheme_legend_item"}>
                            <Chair type={"vip"}/>
                            <div className={"hcm_hall_scheme_chair_title"}>— vip кресла</div>
                        </div>
                        <div className={"hcm_hall_scheme_legend_item"}>
                            <Chair type={"disabled"}/>
                            <div className={"hcm_hall_scheme_chair_title"}>— заблокированные (нет кресла)</div>
                        </div>
                    </div>
                    <div className={"hcm_hall_scheme_title"}>
                        Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши
                    </div>
                    <div className={"hcm_hall_scheme"}>
                        <div className={"hcm_hall_screen"}>ЭКРАН</div>
                        <div className="hcm_hall_seats_main">
                            {seatsGrid?.map((row, rowIndex) => (
                                <div key={`row-${rowIndex}`} className="hcm_hall_seat_row">
                                    {row.map((seat, seatIndex) =>
                                        seat ? (
                                            <button
                                                key={`seat-${seatIndex}`}
                                                className={`hcm_hall_scheme_chair chair--${seat}`}
                                                onClick={() => handleSeatClick(rowIndex, seatIndex)}
                                            />
                                        ) : (
                                            <div key={`gap-${seatIndex}`} className="hcm_hall_seat_gap"/>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            <div className={"common_buttons_box"}>
                <CommonButton className={"button--cancel"} onClick={handleCancel} title={"Отмена"}/>
                <CommonButton className={"button--save"} onClick={handleSaveHallConfig} title={"Сохранить"}/>
            </div>
        </div>
    );
}