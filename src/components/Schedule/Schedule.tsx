import {useState} from "react";
import {useDaysContext} from "../../context/DaysContext.tsx";
import {useCinemaContext} from "../../context/CinemaContext.tsx";
import {MovieSection} from "../Home/MovieSection.tsx";
import {FilmData, SeanceData} from "../../types.tsx";
import "./Schedule.css"

interface Slice {
    start: number;
    end: number;
}

export const Schedule = () => {
    const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());
    const {halls, films, seances} = useCinemaContext()
    const daysOfMonth = useDaysContext()
    const handleDayClick = (index: number, date: Date) => {
        setSelectedDayIndex(index);
        setSelectedDay(date)
    };

    function timeStringToToday(timeString: string) {
        const now = new Date();
        const [hours, minutes] = timeString.split(':').map(Number);
        now.setHours(hours);
        now.setMinutes(minutes);
        return now;
    }

    const getSeances = (filmId: number, selectedDay?: number | null) => {
        if (selectedDay == null) {
            return []
        }
        const date = daysOfMonth[selectedDay];

        let filtered = seances.filter((seance: SeanceData) => seance.seance_filmid === filmId);
        if (date.isToday) {
            const today = new Date();
            filtered = filtered.filter((seance: SeanceData) => timeStringToToday(seance.seance_time).getTime() > today.getTime());
        }
        return filtered;
    }

    const [currentSlice, setCurrentSlice] = useState<Slice>({start: 0, end: 6});

    const clickNext = ({start, end}: Slice) => {
        if (end + 1 > daysOfMonth.length) {
            return;
        }
        const newSLice: Slice = {
            start: start + 1,
            end: end + 1,
        }
        setSelectedDayIndex(5);
        setCurrentSlice(newSLice);
    }

    const clickPrev = ({start, end}: Slice) => {
        const newSLice: Slice = {
            start: start - 1,
            end: end - 1,
        }
        setSelectedDayIndex(1);
        setCurrentSlice(newSLice);
    }
    return (
        <div className={"user_main"}>
            <div className="navigation">
                {daysOfMonth.slice(currentSlice.start, currentSlice.end).map(({
                                                                                  date,
                                                                                  dayOfWeek,
                                                                                  isWeekend,
                                                                                  isToday
                                                                              }, index) => (
                    index === 0 && !isToday
                        ?
                        <div key={index} className={`navigation_arrow`} onClick={() => clickPrev(currentSlice)}>{'<'}</div>
                        :
                        <div
                            key={index}
                            className={`navigation_day  ${selectedDayIndex === index ? 'navigation_day--active' : ''} ${isWeekend ? 'navigation_weekend' : ''}`}
                            onClick={() => handleDayClick(index, date)}
                        >
                            {isToday ? <div className={"navigation_day_today"}>Сегодня
                                    <div>
                                        {dayOfWeek}, {date.getDate()}
                                    </div>
                                </div>

                                : <div>{dayOfWeek},
                                    <div>{date.getDate()}</div>
                                </div>
                            }
                        </div>
                ))}
                <div className="navigation_arrow" onClick={() => clickNext(currentSlice)}>{'>'}</div>
            </div>
            {
                films.filter(film =>
                    seances.some(seance => seance.seance_filmid === film.id))
                    .map((film: FilmData) => (
                        <MovieSection
                            key={film.id}
                            date={selectedDay}
                            film={film}
                            halls={halls.filter(hall => hall.hall_open)}
                            seances={getSeances(film.id, selectedDayIndex)}
                        />
                    ))
            }
        </div>
    );
};