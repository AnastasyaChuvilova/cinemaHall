import {USER_PAGES} from "../../router.tsx";
import {useNavigate} from "react-router-dom";
import "./AdminHeader.css"

export const AdminHeader = () => {
    const navigator = useNavigate();

    return (
        <div className="admin_header">
            <div className="admin_header_title admin_header_font" onClick={() => navigator(USER_PAGES.HOME)}>
                ИДЁМ<span className="font_100">В</span>КИНО
                <div className="admin_header_sub_title">Администраторррская</div>
            </div>
        </div>
    )
}