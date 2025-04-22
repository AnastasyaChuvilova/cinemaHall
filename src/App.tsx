import {Outlet} from "react-router-dom";
import {CinemaProvider} from "./context/CinemaContext.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";

export const App = () => {
    return (
        <CinemaProvider>
            <AuthProvider>
                <Outlet/>
            </AuthProvider>
        </CinemaProvider>
    );
};