import "./UserHome.css"
import {useNavigate} from "react-router-dom";
import {USER_PAGES} from "../../router.tsx";
import {FilmData, HallData, SeanceData} from "../../types.tsx";

interface MovieSectionProps {
    date: Date;
    film: FilmData;
    halls: HallData[];
    seances: SeanceData[];
}

export const MovieSection = ({date, film, halls, seances}: MovieSectionProps) => {
    const navigate = useNavigate()

    const seancesByHall = Object.entries(
        seances.reduce((acc, seance) => {
            const hall = halls.find((h) => h.id === seance.seance_hallid);
            if (!hall) return acc;

            if (!acc[hall.hall_name]) {
                acc[hall.hall_name] = [];
            }
            acc[hall.hall_name].push(seance);
            return acc;
        }, {} as Record<string, typeof seances>)
    ).sort(([a], [b]) => a.localeCompare(b));

    return (
        <div className="movie_section">
            <div className="movie_info">
                <div className="movie_poster">
                    <img src={film.film_poster} height={"175px"} width={"125px"} alt={film.film_name}/>
                    <div className="after"></div>
                </div>

                <div className="movie_description">
                    <div className="description_header">{film.film_name}</div>
                    <div className="movie_synopsis">{film.film_description}</div>
                    <div className="movie_data">
                        <div>
                            {film.film_duration} минут {film.film_origin}
                        </div>
                    </div>
                </div>
            </div>
            <div className="movie_seances">
                <div className="seances_container">
                    {seancesByHall.map(([hallName, hallSeances]) => (
                        <div key={hallName} className="hall_sessions">
                            <div className="bolder_text">{hallName}</div>
                            <div className="seances_list">
                                {hallSeances.map((seance) => (
                                    <button key={seance.id} onClick={() =>
                                        navigate(`${USER_PAGES.SEANCE}/${seance.id}?date=${date.toISOString().split('T')[0]}`)}
                                            className="seances_item seances_item_text">
                                        {seance.seance_time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
