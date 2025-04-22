import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FilmData, HallData, SeanceData} from "../../types.tsx";
import './Timeline.css';
import {AddSeanceModal} from "../Modal/AddSeanceModal/AddSeanceModal.tsx";
import {DeleteSeanceModal} from "../Modal/DeleteSeanceModal/DeleteSeanceModal.tsx";

interface TimelineProps {
    hall: HallData;
    films: FilmData[];
    filmColors: Record<number, string>;
    seances: SeanceData[];
    onAddSeance: (hallId: number, filmId: number, seanceTime: string) => void;
    onDeleteSeance: (seanceId: number) => void;
}

export const Timeline = ({hall, films, filmColors, seances}: TimelineProps) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOverTrash, setDragOverTrash] = useState(false);
    const [selectedFilm, setSelectedFilm] = useState<FilmData | null>(null);
    const [selectedSeance, setSelectedSeance] = useState<SeanceData | null>(null);
    const [updatedSeances, setUpdatedSeances] = useState<SeanceData[]>(seances);

    const timelineRef = useRef<HTMLDivElement | null>(null);

    const calculatePosition = (time: string, duration: number, timelineWidth: number) => {
        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        const position = (totalMinutes / 1440) * timelineWidth;
        const width = (duration / 1440) * timelineWidth;
        return {left: position, width};
    };

    useEffect(() => {
        const handleResize = () => {
            if (timelineRef.current) {
                const timelineWidth = timelineRef.current.offsetWidth;
                const newSeances = seances.map(seance => {
                    const film = films.find(f => f.id === seance.seance_filmid);
                    if (!film) return seance;

                    const {left, width} = calculatePosition(seance.seance_time, film.film_duration, timelineWidth);
                    return {...seance, left, width};
                });
                setUpdatedSeances(newSeances);
            }
        };
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [seances, films]);

    const handleAddDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const handleAddDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const filmId = e.dataTransfer.getData('filmId');
        const film = films.find(f => f.id === Number(filmId));
        if (film) {
            setSelectedFilm(film);
            setIsAddModalOpen(true);
        }
    }, [films]);

    const handleDeleteDragStart = useCallback((e: React.DragEvent, seance: SeanceData) => {
        e.dataTransfer.setData('seanceId', seance.id.toString());
        setIsDragging(true);
        setSelectedSeance(seance);
    }, []);

    const handleDeleteDragEnd = useCallback(() => {
        if (!isDeleteModalOpen) {
            setIsDragging(false);
            setDragOverTrash(false);
            setSelectedSeance(null);
        }
    }, [isDeleteModalOpen]);

    const handleTrashDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOverTrash(true);
    }, []);

    const handleTrashDragLeave = useCallback(() => {
        setDragOverTrash(false);
    }, []);

    const handleTrashDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const seanceId = Number(e.dataTransfer.getData('seanceId'));
        const seance = seances.find(s => s.id === seanceId);

        if (seance) {
            setSelectedSeance(seance);
            setIsDeleteModalOpen(true);
        }

    }, [seances]);

    const handleDeleteModalIsOpen = (open: boolean) => {
        if (open) {
            setIsDeleteModalOpen(true);
        } else {
            setIsDeleteModalOpen(false);
            setIsDragging(false);
            setDragOverTrash(false);
        }
    }

    const handleDeleteConfirmation = useCallback(() => {
        setIsDragging(false);
        setDragOverTrash(false);
        setSelectedSeance(null);
    }, []);

    return (
        <div className="timeline-container">
            <div className="hall-header">{hall.hall_name}</div>
            <div className="timeline-body">
                <div className="trash_area">
                    {isDragging && (
                        <div
                            className={`trash-icon ${dragOverTrash ? 'drag-over' : ''}`}
                            onDragOver={handleTrashDragOver}
                            onDragLeave={handleTrashDragLeave}
                            onDrop={handleTrashDrop}
                        >
                        </div>
                    )}
                </div>

                <div
                    className="timeline"
                    ref={timelineRef}
                    onDragOver={handleAddDragOver}
                    onDrop={handleAddDrop}
                >
                    {updatedSeances.map(seance => {
                        const film = films.find(f => f.id === seance.seance_filmid);
                        if (!film) return null;

                        const {
                            left,
                            width
                        } = calculatePosition(seance.seance_time, film.film_duration, timelineRef.current?.offsetWidth || 720);

                        return (
                            <div key={seance.id}>
                                <div
                                    className="seance-block"
                                    draggable
                                    style={{
                                        left: `${left}px`,
                                        width: `${width}px`,
                                        backgroundColor: filmColors[film.id],
                                    }}
                                    onDragStart={(e) => handleDeleteDragStart(e, seance)}
                                    onDragEnd={handleDeleteDragEnd}
                                >
                                    {film.film_name}
                                </div>
                                <div className="time_start_mark" style={{left: `${left}px`}}>
                                    <div className="time_line_mark"></div>
                                    <div className="time_mark">{seance.seance_time}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {isAddModalOpen && selectedFilm && (
                <AddSeanceModal currentHall={hall} currentFilm={selectedFilm} onOpen={setIsAddModalOpen}/>)}
            {isDeleteModalOpen && selectedSeance && (
                <DeleteSeanceModal seance={selectedSeance} onOpen={handleDeleteModalIsOpen}
                                   confirmDelete={handleDeleteConfirmation}/>
            )}
        </div>
    );
};