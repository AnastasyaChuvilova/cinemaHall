import {Outlet} from "react-router-dom";
import {Header} from "./Header/Header.tsx";
import {DaysProvider} from "../context/DaysContext.tsx";

export const UserPage = () => {
    return (
        <DaysProvider>
            <div className={"user_content"}>
                <Header/>
                <Outlet/>
            </div>
        </DaysProvider>
    );
};