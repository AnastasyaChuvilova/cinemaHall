import {CommonButton} from "../CommonButton/CommonButton.tsx";
import {useEffect, useState} from "react";
import {AddFilmModal} from "../Modal/AddFilmModal/AddFilmModal.tsx";
import "./SeancesGridMain.css"
import {useCinemaContext} from "../../context/CinemaContext.tsx";
import {Timeline} from "../Timeline/Timeline.tsx";
import {BackendApi} from "../BackendApi.tsx";

const filmColors = [
    '#CAFF85',
    '#85FF89',
    '#85FFD3',
    '#85E2FF',
    '#8599FF',
    '#85C1FF'
];

export const SeancesGridMain = () => {
    const {halls, films, seances, updateSeances, updateFilms} = useCinemaContext();
    const [filmColorsMap, setFilmColorsMap] = useState<Record<number, string>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const backendApi = BackendApi.getInstance()

    const getFilmColor = (index: number): string => {
        return filmColors[index % filmColors.length];
    };

    useEffect(() => {
        const colorMap: Record<number, string> = films.reduce((acc, film, index) => {
            acc[film.id] = getFilmColor(index);
            return acc;
        }, {} as Record<number, string>);
        setFilmColorsMap(colorMap);
    }, [films]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddSeance = async (
        hallId: number,
        filmId: number,
        seanceTime: string
    ) => {
        try {
            const response = await backendApi.addSeance(hallId, filmId, seanceTime);
            updateSeances(response);
        } catch (error) {
            console.error('Ошибка при добавлении сеанса:', error);
        }
    };

    const handleDeleteFilm = async (filmId: number) => {
        try {
            const response = await backendApi.deleteFilm(filmId);
            updateFilms(response.films);
            updateSeances(response.seances);
        } catch (error) {
            console.error('Ошибка при удалении фильма:', error);
        }
    };

    const handleDeleteSeance = async (seanceId: number) => {
        try {
            const response = await backendApi.deleteSeance(seanceId);
            updateSeances(response);
        } catch (error) {
            console.error('Ошибка при удалении сеанса:', error);
        }
    };

    return (
        <div className={"seances_grid_main"}>
            <CommonButton onClick={handleOpenModal}
                          title={"Добавить фильм"}
                          className={"add_film_button"}/>
            {isModalOpen && <AddFilmModal onClose={handleCloseModal}/>}
            <div className={"seances_grid_films"}>
                {films.map((film, index) => (
                    <div
                        key={film.id}
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('filmId', film.id.toString());
                        }}
                        className="film-draggable"
                        style={{backgroundColor: getFilmColor(index)}}
                    >
                        <img
                            className={"dnd_poster"}
                            src={film.film_poster}
                            alt={film.film_name}
                        />
                        <div className={"draggable_film_info"}>
                            <div className={"text_500"}><p>{film.film_name}</p></div>
                            <div className={"text_400"}><p>{film.film_duration} мин</p></div>
                        </div>
                        <div className={"remove_button_box"}>
                            <button className={"film_remove_button"} onClick={() => handleDeleteFilm(film.id)}/>
                        </div>
                    </div>
                ))}
            </div>
            {halls.map(hall => <Timeline
                key={hall.id}
                hall={hall}
                films={films}
                filmColors={filmColorsMap}
                seances={seances.filter(seance => seance.seance_hallid === hall.id)}
                onAddSeance={handleAddSeance}
                onDeleteSeance={handleDeleteSeance}/>
            )
            }
        </div>
    );
}