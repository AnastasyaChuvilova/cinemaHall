import {useNavigate} from "react-router-dom";
import {USER_PAGES} from "../../router.tsx";
import {FilmData, HallData, SeanceData} from "../../types.tsx";
import "./Movie.css"

interface MovieSectionProps {
    date: Date;
    film: FilmData;
    halls: HallData[];
    seances: SeanceData[];
}

export const Movie = ({date, film, halls, seances}: MovieSectionProps) => {
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

    const isActiveToday = (seance: SeanceData): boolean => {
        const today = new Date();
        date.setHours(0, 0, 0, 0);
        if (date.getTime() === today.setHours(0, 0, 0, 0)) {
            const seanceDateTime = timeStringToToday(seance.seance_time);
            return seanceDateTime.getTime() > new Date().getTime();
        }
        return true;
    }

    function timeStringToToday(timeString: string): Date {
        const now = new Date();
        const [hours, minutes] = timeString.split(':').map(Number);
        now.setHours(hours, minutes, 0, 0);
        return now;
    }

    return (
        <div className="movie_main">
            <div className="movie_info">
                <div className="movie_poster">
                    <img src={film.film_poster} height={"175px"} width={"125px"} alt={film.film_name}/>
                    <div className="after"></div>
                </div>

                <div className="movie_description">
                    <div className="movie_description_header">{film.film_name}</div>
                    <div className="movie_synopsis">{film.film_description}</div>
                    <div className="movie_data">
                        <div>
                            {film.film_duration} минут {film.film_origin}
                        </div>
                    </div>
                </div>
            </div>
            <div className="movie_seances">
                <div>
                    {seancesByHall.map(([hallName, hallSeances]) => (
                        <div key={hallName}>
                            <div className="bolder_text">{hallName}</div>
                            <div className="movie_seances_list">
                                {hallSeances.map((seance) => (
                                    <button key={seance.id} onClick={() =>
                                        navigate(`${USER_PAGES.SEANCE}/${seance.id}?date=${date.toISOString().split('T')[0]}`)}
                                            className={`movie_seances_item  ${isActiveToday(seance) ? "" : "not_active"}`}>
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
