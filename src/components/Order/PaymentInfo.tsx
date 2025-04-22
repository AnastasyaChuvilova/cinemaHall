import "./Order.css"
import {TicketHeader} from "./TicketHeader.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {BookingData, TicketRequest, TicketResponse} from "../../types.tsx";
import {USER_PAGES} from "../../router.tsx";
import {CommonButton} from "../CommonButton/CommonButton.tsx";
import {BackendApi} from "../BackendApi.tsx";

export const PaymentInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state?.bookingData as BookingData;
    const backendApi = BackendApi.getInstance();

    if (!bookingData) {
        return <div>Нет данных о бронировании</div>;
    }

    const seatsNumbers = bookingData.seats
        .map(seat => seat.id)
        .join(', ');

    const handlePayment = async () => {
        const tickets: TicketRequest[] = bookingData.seats.map(seat => {
            return {
                row: seat.row,
                place: seat.number,
                coast: seat.type === "vip" ? bookingData.vipPrice : bookingData.standartPrice,
            }

        })

        const response: TicketResponse[] = await backendApi.buyTickets(bookingData.seanceId, bookingData.seanceDate, tickets)

        navigate(USER_PAGES.TICKET, {
            state: {bookingData, response}
        });
    };

    return (
        <div className="order_main">
            <TicketHeader title={"Вы выбрали билеты:"}/>
            <div className="order_body_frame">
                <div className="order_payment_info">
                    <div className="order_payment_info_item">
                        <div>На фильм: <span className="bolder">{bookingData.film}</span></div>
                        <div>Места: <span className="bolder">{seatsNumbers}</span></div>
                        <div>В зале: <span className="bolder">{bookingData.hall}</span></div>
                        <div>Начало сеанса: <span className="bolder">{bookingData.time}</span></div>
                        <div>Стоимость: <span className="bolder">{bookingData.totalPrice}</span> рублей</div>
                    </div>
                    <div className={"common_buttons_box"}>
                        <CommonButton className={"button--save"} onClick={handlePayment}
                                      title={"Получить код бронирования"}/>
                    </div>
                    <div className="order_ticket_hint">
                        <div>После оплаты билет будет доступен в этом окне, а также придёт вам
                            на почту. Покажите QR-код нашему контроллёру у входа в зал.
                        </div>
                        <div>Приятного просмотра!</div>
                    </div>
                </div>
            </div>
        </div>
    );
};