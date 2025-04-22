import {CommonButton} from "../../CommonButton/CommonButton.tsx";
import {useCinemaContext} from "../../../context/CinemaContext.tsx";
import {SeanceData} from "../../../types.tsx";
import {BackendApi} from "../../BackendApi.tsx";

interface DeleteSeanceModalProps {
    seance: SeanceData,
    onOpen: (open: boolean) => void,
    confirmDelete: () => void
}

export const DeleteSeanceModal = ({seance, onOpen, confirmDelete}: DeleteSeanceModalProps) => {
    const {films, updateSeances} = useCinemaContext();
    const backendApi = BackendApi.getInstance();

    const handleDeleteSeance = async () => {
        try {
            const response = await backendApi.deleteSeance(seance.id);
            updateSeances(response);
            onOpen(false)
            confirmDelete()
        } catch (error) {
            console.error('Ошибка при удалении сеанса:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className={"common_modal_header"}>Удаление сеанса
                <div className="common_modal_close_cross" onClick={() => onOpen(false)}/>
            </div>
            <div className="common_modal_content">
                <div style={{paddingBottom: "30px"}}>
                    Вы действительно хотите снять с сеанса фильм <span
                    className={"bolder"}>"{films.find(f => f.id === seance.seance_filmid)?.film_name}" ?</span>
                </div>
                <div className="common_modal_buttons">
                    <CommonButton className={"button--save"} onClick={handleDeleteSeance}
                                  title={"Удалить"}/>
                    <CommonButton className={"button--cancel"} onClick={() => onOpen(false)} title={"Отмена"}/>
                </div>
            </div>
        </div>
    )
};