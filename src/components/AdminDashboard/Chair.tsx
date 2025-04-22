import {SeatType} from "../../types.tsx";
import "./Chair.css"
import "../HallConfigMain/HallConfigMain.css"

interface ChairProps{
    type: SeatType
}

export const Chair = ({type} : ChairProps) => {
    return (
        <div className={`hcm_hall_scheme_chair chair--${type}`}/>
    )
}