import "./HallCreator.css"
import {useState} from "react";
import {AddHallModal} from "../Modal/AddHallModal/AddHallModal.tsx";
import {useCinemaContext} from "../../context/CinemaContext.tsx";
import {CommonButton} from "../CommonButton/CommonButton.tsx";
import {BackendApi} from "../../BackendApi.tsx";

export const HallCreator = () => {
    const {halls, updateHalls} = useCinemaContext();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const backendApi = BackendApi.getInstance();

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleCreateHall = async (hallName: string) => {
        if (!hallName || hallName === "") {
            return;
        }
        try {
            const updatedHalls = await backendApi.createHall(hallName);
            updateHalls(updatedHalls);
            setIsPopupOpen(false);
        } catch (error) {
            console.error('Ошибка при создании зала:', error);
        }
    };

    const handleDeleteHall = async (hallId: number) => {
        try {
            const updatedHalls = await backendApi.deleteHall(hallId);
            updateHalls(updatedHalls);
        } catch (error) {
            console.error('Ошибка при удалении зала:', error);
        }
    };

    return (
        <div>
            <div className={"available_halls_title"}>Доступные залы:</div>
            <div className={"available_halls_list"}>
                {halls.map((hall) => (<div key={hall.id} className={"hall_name"}>– {hall.hall_name}
                    <button className="hall_remove_button" onClick={() => handleDeleteHall(hall.id)}/>
                </div>))}
            </div>
            <div className={"create_hall_button"}>
                <CommonButton className={"button--save"} onClick={handleOpenPopup} title={"Создать зал"}/>
            </div>
            {isPopupOpen && <AddHallModal onClose={handleClosePopup} onCreate={handleCreateHall}/>}
        </div>
    )
}