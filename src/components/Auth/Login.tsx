import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {CommonButton} from "../CommonButton/CommonButton.tsx";
import {BackendApi} from "../BackendApi.tsx";
import {useAuth} from "../../context/AuthContext.tsx";
import {ADMIN_PAGES} from "../../router.tsx";
import "./Login.css"

export const Login = () => {
    const {login} = useAuth()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const backendApi = BackendApi.getInstance()

    const handleSubmit = async () => {
        if (!email) {
            setError("Укажите email")
            return;
        }

        if (!password) {
            setError("Укажите пароль")
            return;
        }

        const response = await backendApi.singIn(email, password)
        if (response) {
            console.log(response)
            setError("")
            login()
            navigate(ADMIN_PAGES.MAIN);
        } else {
            setError("Неверный email или пароль");
        }
    };

    return (
        <div className={"login_main"}>
            <div className='common_modal_header' style={{maxWidth: "480px"}}>Авторизация
            </div>
            <div className="common_modal_content" style={{maxWidth: "480px"}}>
                <div className="common_input_wrapper" style={{maxWidth: "272px"}}>
                    <div className='common_input_label'>
                        E-mail
                    </div>
                    <input
                        className='common_input_body'
                        style={{maxWidth: "272px"}}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className='common_input_label'>
                        Пароль
                    </div>
                    <input
                        className='common_input_body'
                        style={{maxWidth: "272px"}}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className={"common_buttons_box"} style={{marginTop: "18px"}}>
                    <CommonButton className={"button--save"} onClick={handleSubmit} title={"Авторизоваться"}/>
                </div>
                <div className={"modal_message_area"} style={{color: "red", height: "5px", marginTop: "5px"}}>
                    {error ? error : ""}
                </div>
            </div>
        </div>
    );
};