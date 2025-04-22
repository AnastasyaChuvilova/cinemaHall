import './AddHallModal.css';
import {useState} from "react";
import {CommonButton} from "../../CommonButton/CommonButton.tsx";

interface HallCreateProps {
    onClose: () => void;
    onCreate: (hallName: string) => void;
}

export const AddHallModal = ({onClose, onCreate}: HallCreateProps) => {
    const [hallName, setHallName] = useState("")

    return (
        <div className="modal-overlay">
            <div className="common_modal_header">Добавление зала
                <div className="common_modal_close_cross" onClick={onClose}/>
            </div>
            <div className="common_modal_content">
                <div className="common_input_wrapper">
                    <div className="common_input_label">
                        Название зала
                    </div>
                    <input className={"common_input_body"} type="text" placeholder={"Например,«Зал 1»"}
                           onChange={(e) => setHallName(e.target.value)}/>
                </div>
                <div className="common_buttons_box" style={{marginTop: "43px"}}>
                    <CommonButton className={"button--save"} onClick={() => onCreate(hallName)}
                                  title={"Добавить зал"} disabled={hallName === ""}/>
                    <CommonButton className={"button--cancel"} onClick={onClose} title={"Отменить"}/>
                </div>
            </div>
        </div>
    );
};