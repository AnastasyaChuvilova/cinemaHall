import React, {createContext, useContext, useEffect, useState} from "react";

export type DayContextType = {
    date: Date;
    dayOfWeek: string;
    isWeekend: boolean;
    isToday: boolean;
}

const DaysContext = createContext<DayContextType[] | null>([]);

export const DaysProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [days, setDays] = useState<DayContextType[]>([]);

    useEffect(() => {
        const generateDays = () => {
            const daysArray: DayContextType[] = [];
            const today = new Date();

            for (let i = 0; i < 31; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);

                const dayOfWeek = date.toLocaleDateString('ru-RU', {weekday: 'short'});
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const isToday = i === 0;

                daysArray.push({
                    date,
                    dayOfWeek: dayOfWeek,
                    isWeekend,
                    isToday,
                });
            }
            return daysArray;
        };

        setDays(generateDays());
    }, []);

    return (
        <DaysContext.Provider value={days}>
            {days.length > 0 ? children : <div className={"not_found"}>Загрузка дней...</div>}
        </DaysContext.Provider>
    );
};

export const useDaysContext = () => {
    const context = useContext(DaysContext);
    if (!context) {
        throw new Error('Даты не загружены');
    }
    return context;
};