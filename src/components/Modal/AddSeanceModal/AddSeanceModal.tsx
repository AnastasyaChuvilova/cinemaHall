import {CommonButton} from "../../CommonButton/CommonButton.tsx";
import {useCinemaContext} from "../../../context/CinemaContext.tsx";
import {FilmData, HallData} from "../../../types.tsx";
import {useState} from "react";
import {BackendApi} from "../../../BackendApi.tsx";

interface AddSeanceModalProps {
    currentHall: HallData;
    currentFilm: FilmData;
    onOpen: (open: boolean) => void;
}

export const AddSeanceModal = ({currentHall, currentFilm, onOpen}: AddSeanceModalProps) => {
    const {halls, films, updateSeances} = useCinemaContext();
    const [selectedHall, setSelectedHall] = useState<HallData>(currentHall);
    const [selectedFilm, setSelectedFilm] = useState<FilmData>(currentFilm);
    const [startTime, setStartTime] = useState<string>('00:00');
    const backendApi = BackendApi.getInstance();

    const handleHallSelect = (event: any) => {
        const hall = halls.find(h => h.hall_name === event.target.value);
        if (hall) {
            setSelectedHall(hall);
        }
    }

    const handleFilmSelect = (event: any) => {
        const film = films.find(f => f.film_name === event.target.value);
        if (film) {
            setSelectedFilm(film);
        }
    }

    const handleAddSeance = async () => {
        try {
            const response = await backendApi.addSeance(selectedHall.id, selectedFilm.id, startTime);
            updateSeances(response);
            onOpen(false)
        } catch (error) {
            console.error('Ошибка при добавлении сеанса:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="common_modal_header">Добавление сеанса
                <div className="common_modal_close_cross" onClick={() => onOpen(false)}/>
            </div>
            <div className="common_modal_content">
                <div className="common_input_wrapper">
                    <label className="common_input_label">
                        Название зала
                    </label>
                    <div>
                        <select className={"common_input_body"} onChange={handleHallSelect}>
                            <option value="">{currentHall.hall_name}</option>
                            {halls
                                .filter(h => h.hall_name !== currentHall.hall_name)
                                .map(h => (
                                    <option key={h.hall_name} value={h.hall_name}>
                                        {h.hall_name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <label className="common_input_label">
                        Название фильма
                    </label>
                    <div>
                        <select className={"common_input_body"} onChange={handleFilmSelect}>
                            <option value="">{currentFilm.film_name}</option>
                            {films
                                .filter(f => f.film_name !== currentFilm.film_name)
                                .map(f => (
                                    <option key={f.film_name} value={f.film_name}>
                                        {f.film_name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <label className={"common_input_label"}>Время начала:</label>
                    <div>
                        <input className={"common_input_body"}
                               type="time"
                               value={startTime}
                               onChange={(e) => setStartTime(e.target.value)}
                               step="300"
                               min="00:00"
                               max="23:59"
                        />
                    </div>
                </div>
                <div>
                </div>
                <div className="common_modal_buttons">
                    <CommonButton className={"button--save"} onClick={handleAddSeance}
                                  title={"Добавить"}/>
                    <CommonButton className={"button--cancel"} onClick={() => onOpen(false)}
                                  title={"Отмена"}/>
                </div>
            </div>
        </div>
    )
};
