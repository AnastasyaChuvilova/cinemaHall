declare global {
    interface Window {
        QRCreator: any;
    }
}

export interface HallData {
    id: number;
    hall_name: string;
    hall_rows: number;
    hall_places: number;
    hall_config: SeatType[][];
    hall_price_standart: number;
    hall_price_vip: number;
    hall_open: boolean;
}

export interface FilmData {
    id: number;
    film_name: string;
    film_duration: number;
    film_description: string;
    film_origin: string;
    film_poster: string;
    color: string;
}

export interface SeanceData {
    id: number;
    seance_filmid: number;
    seance_hallid: number;
    seance_time: string;
}

export type SeatType = "standart" | "vip" | "taken" | "disabled";

export interface Seat {
    id: number;
    row: number;
    number: number;
    type: SeatType;
    isSelected?: boolean;
}

export interface BookingData {
    seanceId: number;
    seanceDate: string;
    film: string;
    seats: Seat[];
    hall: string;
    time: string;
    totalPrice: number;
    vipPrice: number;
    standartPrice: number;
}

export interface TicketRequest {
    row: number;
    place: number;
    coast: number;
}

export interface TicketResponse {
    id: number;
    ticket_date: string,
    ticket_time: string,
    ticket_filmname: string,
    ticket_hallname: string,
    ticket_row: number,
    ticket_place: number,
    ticket_price: number,
}