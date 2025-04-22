import {Outlet} from "react-router-dom";
import {AdminHeader} from "./AdminHeader/AdminHeader.tsx";

export const AdminPage = () => {
    return (
            <div className={"admin_content"}>
                <AdminHeader/>
                <Outlet/>
            </div>
    );
};