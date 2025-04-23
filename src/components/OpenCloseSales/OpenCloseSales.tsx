import {HallListButtons} from "../HallListButtons/HallListButtons.tsx";
import {CommonButton} from "../CommonButton/CommonButton.tsx";
import {useCinemaContext} from "../../context/CinemaContext.tsx";
import {useState} from "react";
import "./OpenCloseSales.css"
import {HallData} from "../../types.tsx";
import {BackendApi} from "../../BackendApi.tsx";

export const OpenCloseSales = () => {
    const {halls, updateHalls} = useCinemaContext();
    const [selectedHall, setSelectedHall] = useState<HallData | undefined>(halls[0]);
    const [isSelectedHallOpen, setIsSelectedHallOpen] = useState<boolean | undefined>(false);
    const backendApi = BackendApi.getInstance();

    const handleSelectHall = (hallId: number) => {
        const hall = halls.find(hall => hall.id === hallId)
        setSelectedHall(hall);
        setIsSelectedHallOpen(hall?.hall_open)
    }

    const handleOpenCloseHall = async (open: number) => {
        if (!selectedHall) {
            return;
        }
        try {
            const response = await backendApi.openCloseHall(selectedHall.id, open);
            updateHalls(response);
            setIsSelectedHallOpen(open === 1)
        } catch (error) {
            console.error('Ошибка при открытии/закрытии кинозала:', error);
        }
    };

    return (
        <div className={"open_close_sales"}>
            <label className={"open_close_sales_label"}>Выберите зал для открытия/закрытия продаж:</label>
            <HallListButtons halls={halls} onSelectHall={handleSelectHall} selectedHall={selectedHall}/>
            <div
                className={"open_close_sales_text"}>{isSelectedHallOpen ? "Зал открыт" : "Всё готово к открытию"}</div>
            <div className={"common_buttons_box"}>
                {selectedHall && isSelectedHallOpen ?
                    <CommonButton className={"button--cancel"} onClick={() => handleOpenCloseHall(0)}
                                  title={"Приостановить продажу билетов"}/> :
                    <CommonButton className={"button--save"} onClick={() => handleOpenCloseHall(1)}
                                  title={"Открыть продажу билетов"}/>}
            </div>
        </div>
    );
};
