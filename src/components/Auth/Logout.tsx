import {useAuth} from "../../context/AuthContext.tsx";
import {useEffect} from "react";
import {USER_PAGES} from "../../router.tsx";
import {useNavigate} from "react-router-dom";

export const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate(USER_PAGES.HOME);
    }, [logout]);

    return null;
};