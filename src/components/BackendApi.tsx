import {SeatType, TicketRequest} from "../types.tsx";

export class BackendApi {
    private static instance: BackendApi;
    private readonly baseUrl: string;

    private constructor() {
        this.baseUrl = 'https://shfe-diplom.neto-server.ru';
    }

    public static getInstance(): BackendApi {
        if (!BackendApi.instance) {
            BackendApi.instance = new BackendApi();
        }
        return BackendApi.instance;
    }

    async fetchCinemaData() {
        const response = await fetch('https://shfe-diplom.neto-server.ru/alldata');
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        return data.result;
    }

    async singIn(login: string, password: string) {
        const params = new FormData();
        params.set('login', login);
        params.set('password', password);

        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            body: params
        });

        const data = await response.json();

        return data.success;
    }

    async buyTickets(seanceId: number, ticketDate: string, tickets: TicketRequest[]) {
        const params = new FormData();
        params.set('seanceId', `${seanceId}`);
        params.set('ticketDate', ticketDate);
        params.set('tickets', JSON.stringify(tickets));

        const response = await fetch(`${this.baseUrl}/ticket`, {
            method: 'POST',
            body: params
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        return data.result;
    }

    async createHall(hallName: string) {
        const params = new FormData();
        params.set('hallName', hallName);

        const response = await fetch(`${this.baseUrl}/hall`, {
            method: 'POST',
            body: params
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        return data.result.halls;
    }

    async deleteHall(hallId: number) {
        const response = await fetch(`${this.baseUrl}/hall/${hallId}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        return data.result.halls;
    }

    async saveHallConfig(hallId: number, rows: number, seats: number, seatsGrid: SeatType[][]) {
        const params = new FormData();
        params.set('rowCount', `${rows}`);
        params.set('placeCount', `${seats}`);
        params.set('config', JSON.stringify(seatsGrid));

        const response = await fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
            method: 'POST',
            body: params
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        return data.result;
    };

    async saveTicketPrice(hallId: number, standartPrice: string, vipPrice: string) {
        const params = new FormData();
        params.set("priceStandart", standartPrice);
        params.set("priceVip", vipPrice);

        const response = await fetch(`https://shfe-diplom.neto-server.ru/price/${hallId}`, {
            method: "POST",
            body: params,
        })

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        return data.result;
    };

    async addFilm(filmName: string,
                  filmDuration: number,
                  filmDescription: string,
                  filmOrigin: string,
                  poster: File
    ) {
        const formData = new FormData();
        formData.append('filmName', filmName);
        formData.append('filmDuration', `${filmDuration}`);
        formData.append('filmDescription', filmDescription);
        formData.append('filmOrigin', filmOrigin);
        formData.append('filePoster', poster);

        const response = await fetch('https://shfe-diplom.neto-server.ru/film', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        return data.result.films;
    };

    async addSeance(hallId: number, filmId: number, seanceTime: string) {
        const formData = new FormData();
        formData.append('seanceHallid', `${hallId}`);
        formData.append('seanceFilmid', `${filmId}`);
        formData.append('seanceTime', seanceTime);

        const response = await fetch('https://shfe-diplom.neto-server.ru/seance', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        return data.result.seances;
    };

    async deleteFilm(filmId: number) {
        const response = await fetch(`https://shfe-diplom.neto-server.ru/film/${filmId}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }
        return data.result;
    };

    async deleteSeance(seanceId: number) {
        const response = await fetch(`https://shfe-diplom.neto-server.ru/seance/${seanceId}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }
        return data.result.seances;
    };


    async openCloseHall(hallId: number, open: number) {
        const params = new FormData()
        params.set('hallOpen', `${open}`)
        const response = await fetch(`https://shfe-diplom.neto-server.ru/open/${hallId}`, {
            method: 'POST',
            body: params
        })

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        return data.result.halls;
    };

    async getHallConfig(seanceId: number, date: string) {
        const response = await fetch(`https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${date}`, {
            method: 'GET',
        })

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        return data.result;
    };
}
