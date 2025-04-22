import {useEffect, useRef} from 'react';
import {TicketHeader} from "./TicketHeader.tsx";
import {useLocation} from "react-router-dom";
import {BookingData, TicketResponse} from "../../types.tsx";
import "./Order.css";

export const TicketInfo = () => {
    const location = useLocation();
    const bookingData = location.state?.bookingData as BookingData;
    const ticketResponse = location.state?.response as TicketResponse[];
    const qrRef = useRef<HTMLDivElement>(null);

    if (!bookingData) {
        return <div className="not_found">Нет данных о бронировании</div>;
    }

    useEffect(() => {
        if (!qrRef.current) return;

        try {
            const qrContent = ticketResponse.map(ticket => `
            --------------------------------------------------------------------
            ID: ${ticket.id}
            Билет в кинотеатр
            Фильм: ${ticket.ticket_filmname}
            Зал: ${ticket.ticket_hallname}
            Дата: ${ticket.ticket_date}
            Время: ${ticket.ticket_time}
            Ряд: ${ticket.ticket_row}
            Место: ${ticket.ticket_place}
            Стоимость: ${ticket.ticket_price} руб.
            
            Билет действителен строго на свой сеанс!`).join('\n\n');

            const qr = window.QRCreator(qrContent, {
                modsize: 5,
                margin: 2,
                eccl: 3
            });

            qrRef.current.innerHTML = '';

            if (qr.result) {
                qrRef.current.appendChild(qr.result);
            }

        } catch (error) {
            console.error('Ошибка генерации QR-кода:', error);
        }
    }, [bookingData, ticketResponse]);

    const seatsNumbers = bookingData.seats
        .map(seat => seat.id)
        .join(', ');

    return (
        <div className="order_main">
            <TicketHeader title={"Электронный билет"}/>
            <div className="ticket_body_frame">
                <div className="order_ticket_info">
                    <div>На фильм: <span className="bolder">{bookingData.film}</span></div>
                    <div>Места: <span className="bolder">{seatsNumbers}</span></div>
                    <div>В зале: <span className="bolder">{bookingData.hall}</span></div>
                    <div>Начало сеанса: <span className="bolder">{bookingData.time}</span></div>
                    <div className="qr_code_wrapper">
                        <div className="qr_code" ref={qrRef}></div>
                    </div>
                    <div className="order_ticket_hint">
                        <div>Покажите QR-код нашему контроллеру для подтверждения бронирования.</div>
                        <div>Приятного просмотра!</div>
                    </div>
                </div>
            </div>
        </div>
    );
};