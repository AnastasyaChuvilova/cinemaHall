import {createBrowserRouter, Navigate, redirect} from "react-router-dom";
import {UserHome} from "./components/Home/UserHome.tsx";
import {App} from "./App.tsx";
import {Seance} from "./components/Booking/Seance.tsx";
import {TicketInfo} from "./components/Order/TicketInfo.tsx";
import {PaymentInfo} from "./components/Order/PaymentInfo.tsx";
import {Login} from "./components/Auth/Login.tsx";
import {Logout} from "./components/Auth/Logout.tsx";
import {AdminPage} from "./components/AdminPage.tsx";
import {UserPage} from "./components/UserPage.tsx";
import {useAuth} from "./context/AuthContext.tsx";
import {JSX} from "react";
import {AdminDashboard} from "./components/AdminDashboard/AdminDashboard.tsx";

export const USER_PAGES = {
    HOME: "/",
    SEANCE: "/seance",
    PAYMENT: "/payment",
    TICKET: "/ticket",
    ADMIN: "/admin/login",
}

export const ADMIN_PAGES = {
    LOGIN: "/admin/login",
    LOGOUT: "/admin/logout",
    MAIN: "/admin/dashboard"
}

const ProtectedRoute = ({children}: { children: JSX.Element }) => {
    const {isAuthenticated} = useAuth();
    return isAuthenticated ? children : <Navigate to={ADMIN_PAGES.LOGIN} replace/>;
};


export const router = createBrowserRouter([
    {
        path: USER_PAGES.HOME,
        element: <App/>,
        children: [
            {
                element: <UserPage/>,
                children: [
                    {
                        path: USER_PAGES.HOME,
                        element: <UserHome/>
                    },
                    {
                        path: USER_PAGES.SEANCE + "/:id",
                        element: <Seance/>
                    },
                    {
                        path: USER_PAGES.PAYMENT,
                        element: <PaymentInfo/>
                    },
                    {
                        path: USER_PAGES.TICKET,
                        element: <TicketInfo/>
                    },
                ]
            },
            {
                element: <AdminPage/>,
                children: [
                    {
                        path: ADMIN_PAGES.LOGIN,
                        element: <Login/>,
                        loader: () => {
                            const isAuth = localStorage.getItem("isAuthenticated") === "true";
                            return isAuth ? redirect(ADMIN_PAGES.MAIN) : null;
                        }
                    },
                    {
                        path: ADMIN_PAGES.MAIN,
                        element: <ProtectedRoute><AdminDashboard/></ProtectedRoute>
                    },
                    {
                        path: ADMIN_PAGES.LOGOUT,
                        element: <Logout/>
                    }

                ]
            }
        ]
    }
]);