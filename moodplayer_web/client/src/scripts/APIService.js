export class APIService {

    constructor(token) {

        this.baseURL = "https://api.spotify.com/v1";
    }

    async request(endpoint, method, options = {}) {

        try {
            const fetchReq = await fetch(`${this.baseURL}/${endpoint}/${!options.headers.id ? "" : options.headers.id}`, {

                method: method,
                headers: { Authorization: 'Bearer ' + `${this.token}`, ...options.headers },
                body: (options.body) ? JSON.stringify(options.body) : undefined
            });

            if (fetchReq.status === 401) {

                const request = await fetch("http://127.0.0.1:3000/api/auth/refreshtoken");
                const response = await request.json();

                return response;
            }

            // return parsed JSON body
            return await fetchReq.json();
        }
        catch (error) {

            console.error("FETCH REQUEST FAILED: ", error);
            throw error;
        }
    }

    setToken(token) {

        if (token !== null && typeof token === "string") { this.token = token }
        console.error("Token invalid")
    }

    getToken() { return !(token) ? null : this.token }
}



export async function BackendFetch(method, endpoint, options = {}) {
    const baseUrl = "http://127.0.0.1:3000/api/";

    try {

        const request = await fetch(`${baseUrl}${endpoint}`, {

            method: `${method}`,
            ...options,
            credentials: "include"

        });

        if (request.status === 404) {

            throw new Error("Cannot find route.");
        }

        const response = await request.json();
        return response;
    }
    catch (error) {

        console.error(error);

    }
}