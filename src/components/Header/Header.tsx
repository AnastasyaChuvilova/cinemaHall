import {ADMIN_PAGES, USER_PAGES} from "../../router.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import "./Header.css"

export const Header = () => {
    const location = useLocation();
    const navigator = useNavigate();

    const handleClick = () => {
        navigator(ADMIN_PAGES.LOGIN)
    }

    return (
        <div className="user_header">
            <div className="user_header_title" onClick={() => navigator(USER_PAGES.HOME)}>
                ИДЁМ<span className="light">В</span>КИНО
            </div>
            <button onClick={handleClick} className={"sing_in_button"} hidden={location.pathname != USER_PAGES.HOME}>Войти</button>
        </div>
    )
}