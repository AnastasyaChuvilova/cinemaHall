import "./AdminDashboard.css"
import {AdminItem} from "./AdminItem.tsx";
import {HallCreator} from "../HallCreator/HallCreator.tsx";
import {HallConfigMain} from "../HallConfigMain/HallConfigMain.tsx";
import {PriceConfigMain} from "../PriceConfigMain/PriceConfigMain.tsx";
import {SeancesGridMain} from "../SeancesGridMain/SeancesGridMain.tsx";
import {OpenCloseSales} from "../OpenCloseSales/OpenCloseSales.tsx";

export const AdminDashboard = () => {
    return (
        <div className={"admin_dashboard_main"}>
            <AdminItem title={"Управление залами"} first={true} content={<HallCreator/>}/>
            <AdminItem title={"Конфигурация залов"} content={<HallConfigMain/>}/>
            <AdminItem title={"Конфигурация цен"} content={<PriceConfigMain/>}/>
            <AdminItem title={"Сетка сеансов"} content={<SeancesGridMain/>}/>
            <AdminItem title={"Открыть продажи"} last={true} content={<OpenCloseSales/>}/>
        </div>
    );
};