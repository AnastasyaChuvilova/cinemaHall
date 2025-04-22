import React, {createContext, useContext, useEffect, useState} from 'react';
import {FilmData, HallData, SeanceData} from "../types.tsx";
import {BackendApi} from "../components/BackendApi.tsx";

type CinemaContextType = {
    halls: HallData[];
    films: FilmData[];
    seances: SeanceData[];
    updateHall: (updatedHall: HallData) => void;
    updateHalls: (halls: HallData[]) => void;
    updateSeances: (seances: SeanceData[]) => void;
    updateFilms: (films: FilmData[]) => void;
    addHall: (newHall: HallData) => void;
    addFilm: (newFilm: FilmData) => void;
    addSeance: (newSeance: SeanceData) => void;
};

const CinemaContext = createContext<CinemaContextType | null>(null);

export const CinemaProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [apiData, setApiData] = useState<CinemaContextType | null>(null);
    const backendApi = BackendApi.getInstance()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await backendApi.fetchCinemaData();
                setApiData(response);
            } catch (err) {
                console.error('Ошибка при загрузке данных кинотеатра');
            }
        };
        fetchData();
    }, []);

    if (!apiData) return <div className={"not_found"}>Загрузка...</div>;

    const updateHall = (updatedHall: HallData) => {
        setApiData(prevData => {
            if (!prevData) return null;
            const updatedHalls = prevData.halls.map(hall =>
                hall.id === updatedHall.id ? updatedHall : hall
            );
            return {...prevData, halls: updatedHalls};
        });
    };

    const updateHalls = (halls: HallData[]) => {
        setApiData(prevData => {
            if (!prevData) return null;
            return {...prevData, halls};
        });
    };

    const updateSeances = (seances: SeanceData[]) => {
        setApiData(prevData => {
            if (!prevData) return null;
            return {...prevData, seances};
        });
    };

    const updateFilms = (films: FilmData[]) => {
        setApiData(prevData => {
            if (!prevData) return null;
            return {...prevData, films};
        });
    };

    const addHall = (newHall: HallData) => {
        setApiData(prevData => {
            if (!prevData) return null;
            return {...prevData, halls: [...prevData.halls, newHall]};
        });
    };

    const addFilm = (newFilm: FilmData) => {
        setApiData(prevData => {
            if (!prevData) return null;
            return {...prevData, films: [...prevData.films, newFilm]};
        });
    };

    const addSeance = (newSeance: SeanceData) => {
        setApiData(prevData => {
            if (!prevData) return null;
            return {...prevData, seances: [...prevData.seances, newSeance]};
        });
    };

    const value = {
        halls: apiData.halls,
        films: apiData.films,
        seances: apiData.seances,
        updateHall,
        updateHalls,
        updateSeances,
        updateFilms,
        addHall,
        addFilm,
        addSeance,
    };

    return (
        <CinemaContext.Provider value={value}>
            {children}
        </CinemaContext.Provider>
    );
};

export const useCinemaContext = () => {
    const context = useContext(CinemaContext);
    if (!context) {
        throw new Error('Нет контекста кинотеатра');
    }
    return context;
};
