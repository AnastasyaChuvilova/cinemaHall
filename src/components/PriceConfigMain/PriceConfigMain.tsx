import {useEffect, useState} from "react";
import {HallListButtons} from "../HallListButtons/HallListButtons.tsx";
import {useCinemaContext} from "../../context/CinemaContext.tsx";
import {Chair} from "../AdminDashboard/Chair.tsx";
import {CommonButton} from "../CommonButton/CommonButton.tsx";
import "./PriceConfigMain.css";
import {HallData} from "../../types.tsx";
import {BackendApi} from "../../BackendApi.tsx";

export const PriceConfigMain = () => {
    const {halls, updateHall} = useCinemaContext();
    const [selectedHall, setSelectedHall] = useState<HallData | undefined>(halls[0]);
    const [inputValues, setInputValues] = useState({
        standart: selectedHall ? String(selectedHall.hall_price_standart) : '',
        vip: selectedHall ? String(selectedHall.hall_price_vip) : ''
    });
    const backendApi = BackendApi.getInstance()

    useEffect(() => {
        if (selectedHall) {
            setInputValues({
                standart: String(selectedHall.hall_price_standart),
                vip: String(selectedHall.hall_price_vip)
            });
        }
    }, [selectedHall]);

    const handleSelectHall = (hallId: number) => {
        const hall = halls.find(hall => hall.id === hallId)
        setSelectedHall(hall);
    };

    const handleCancel = () => {
        setInputValues({
            standart: String(selectedHall?.hall_price_standart),
            vip: String(selectedHall?.hall_price_vip)
        });
    };

    const handleSaveTicketPrice = async () => {
        if (!selectedHall) {
            return;
        }

        try {
            const response = await backendApi.saveTicketPrice(
                selectedHall.id,
                inputValues.standart,
                inputValues.vip
            )
            updateHall(response);
            setSelectedHall(response);

        } catch (error) {
            console.error("Ошибка при сохранении цен:", error);
        }
    };

    const handleInputFocus = (type: 'standart' | 'vip') => {
        setInputValues(prev => ({...prev, [type]: ''}));
    };

    const handleInputChange = (type: 'standart' | 'vip', value: string) => {
        setInputValues(prev => ({...prev, [type]: Math.max(0, Number(value))}));
    };

    const handleInputBlur = (type: 'standart' | 'vip') => {
        if (inputValues[type] === '' && selectedHall) {
            setInputValues(prev => ({
                ...prev,
                [type]: String(selectedHall[`hall_price_${type}`])
            }));
        }
    };

    return (
        <div className={"price_config_main"}>
            <label className={"price_config_label"}>Выберите зал для конфигурации:</label>
            <HallListButtons halls={halls} onSelectHall={handleSelectHall} selectedHall={selectedHall}/>
            <div className={"price_config_label"}>Установите цены для типов кресел:</div>

            <form className={"pcm_set_price_main"}>
                <div className={"pcm_set_price"}>
                    <label className={"common_input_label"}>Цена, рублей</label>
                    <div className={"pcm_set_price_row"}>
                        <input
                            className={"pcm_set_price_input"}
                            type="number"
                            min={0}
                            value={inputValues.standart}
                            onFocus={() => handleInputFocus('standart')}
                            onChange={(e) => handleInputChange('standart', e.target.value)}
                            onBlur={() => handleInputBlur('standart')}
                        />
                        <div className={"pcm_legend_description_text"}>за</div>
                        <Chair type={"standart"}/>
                        <div className={"pcm_legend_description_text"}>обычные кресла</div>
                    </div>
                </div>
                <div>
                    <label className={"common_input_label"}>Цена, рублей</label>
                    <div className={"pcm_set_price_row"}>
                        <input
                            className={"pcm_set_price_input"}
                            type="number"
                            min={0}
                            value={inputValues.vip}
                            onFocus={() => handleInputFocus('vip')}
                            onChange={(e) => handleInputChange('vip', e.target.value)}
                            onBlur={() => handleInputBlur('vip')}
                        />
                        <div className={"pcm_legend_description_text"}>за</div>
                        <Chair type={"vip"}/>
                        <div className={"pcm_legend_description_text"}>VIP кресла</div>
                    </div>
                </div>
            </form>
            <div className={"common_buttons_box"} style={{marginTop: "15px"}}>
                <CommonButton className={"button--cancel"} onClick={handleCancel} title={"Отмена"}/>
                <CommonButton className={"button--save"} onClick={handleSaveTicketPrice} title={"Сохранить"}/>
            </div>
        </div>
    );
};
