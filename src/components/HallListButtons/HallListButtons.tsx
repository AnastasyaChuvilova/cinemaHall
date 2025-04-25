import "./HallListButtons.css";
import {HallData} from "../../types.tsx";

type HallListButtonsProps = {
    halls: HallData[];
    selectedHall: HallData | undefined;
    onSelectHall: (hallId: number) => void;
};

export const HallListButtons = ({
                                    halls,
                                    selectedHall,
                                    onSelectHall,
                                }: HallListButtonsProps) => {
    return (
        <div className={"halls_list_buttons"}>
            {halls.map((hall) => (
                <button
                    key={hall.id}
                    className={`halls_list_button ${
                        hall.id === selectedHall?.id ? "halls_list_button--active font_900" : ""
                    }`}
                    onClick={() => onSelectHall(hall.id)}
                >
                    {hall.hall_name}
                </button>
            ))}
        </div>
    );
};