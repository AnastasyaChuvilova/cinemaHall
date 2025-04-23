import {useRef, useState} from "react";
import {CommonButton} from "../../CommonButton/CommonButton.tsx";
import {useCinemaContext} from "../../../context/CinemaContext.tsx";
import {BackendApi} from "../../../BackendApi.tsx";
import "./AddFilmModal.css";

export const AddFilmModal = ({onClose}: { onClose: () => void }) => {
    const {updateFilms} = useCinemaContext();
    const [filmName, setFilmName] = useState<string>("")
    const [filmDuration, setFilmDuration] = useState<number>(0)
    const [filmDescription, setFilmDescription] = useState<string>("")
    const [filmOrigin, setFilmOrigin] = useState<string>("")
    const [filePoster, setFilePoster] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<string>('');
    const backendApi = BackendApi.getInstance()

    const handleFileChange = (event: any) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            if (selectedFile.type !== 'image/png') {
                setError('Файл должен быть в формате PNG');
                return;
            }

            if (selectedFile.size > 3 * 1024 * 1024) {
                setError('Размер файла не должен превышать 3 MB');
                return;
            }
            setFilePoster(selectedFile);
            setError('');
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleAddFilm = async () => {
        if (filmName === "") {
            setError("Укажите название фильма");
            return
        } else if (filmDuration === 0) {
            setError("Укажите продолжительность фильма");
            return
        } else if (filmDescription === "") {
            setError("Укажите описание фильма");
            return
        } else if (filmOrigin === "") {
            setError("Укажите страну фильма");
            return
        }
        if (!filePoster) {
            setError("Загрузите постер фильма");
            return;
        }

        setError('');

        try {
            const result = await backendApi.addFilm(
                filmName,
                filmDuration,
                filmDescription,
                filmOrigin,
                filePoster
            )
            updateFilms(result);
            onClose()

        } catch (error) {
            console.error("Ошибка добавления фильма:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="common_modal_header">Добавление фильма
                <div className="common_modal_close_cross" onClick={onClose}/>
            </div>

            <div className="common_modal_content">
                <div className="common_input_wrapper">
                    <div className="common_input_label">
                        Название фильма
                    </div>
                    <div>
                        <input className={"common_input_body"} type="text"
                               placeholder={"Например,«Гражданин Кейн»"}
                               onChange={(e) => setFilmName(e.target.value)}/>
                    </div>
                    <div className="common_input_label">
                        Продолжительность фильма (мин.)
                    </div>
                    <div>
                        <input className={"common_input_body"} type="number"
                               onChange={(e) => setFilmDuration(Number(e.target.value))}/>
                    </div>
                    <div className="common_input_label">
                        Описание фильма
                    </div>
                    <div>
                <textarea className="common_input_body" style={{height: "80px"}}
                          onChange={(e) => setFilmDescription(e.target.value)}/>
                    </div>
                    <div className="common_input_label">
                        Страна
                    </div>
                    <div>
                        <input className={"common_input_body"} type="text"
                               onChange={(e) => setFilmOrigin(e.target.value)}/>
                    </div>

                    <div className="common_buttons_box" style={{marginTop: "42px"}}>
                        <CommonButton title={"Добавить фильм"}
                                      onClick={handleAddFilm}
                                      className={"button--save"}/>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{display: 'none'}}
                            onChange={handleFileChange}
                        />
                        <CommonButton title={"Загрузить постер"}
                                      onClick={handleUploadClick}
                                      className={"button--save"}/>
                        <CommonButton title={"Отменить"}
                                      onClick={onClose}
                                      className={"button--cancel"}/>

                    </div>
                    <div className="modal_message_area">
                        {filePoster && <div style={{color: 'black'}}>{filePoster.name}</div>}
                        {error && <div style={{color: 'red'}}>{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};