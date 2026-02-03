export class APIService {

    constructor(token) {
        this.token = token;
        this.baseURL = "https://api.spotify.com/v1";
    }

    setToken(token) {
        if (typeof token === "string" && token.length > 0) {
            this.token = token;
        } else {
            console.error("Token invalid");
        }
    }

    getToken() {
        return this.token || null;
    }

    async request(endpoint, method, options = {}) {
        if (!this.token) {
            throw new Error("Missing access token for APIService request");
        }

        try {
            const url = `${this.baseURL}/${endpoint}${options.headers?.id ? `/${options.headers.id}` : ""}`;

            const fetchReq = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    ...(options.headers || {}),
                },
                body: options.body ? JSON.stringify(options.body) : undefined,
            });

            // Let callers handle 401/other errors explicitly
            if (!fetchReq.ok) {
                const text = await fetchReq.text();
                throw new Error(`Spotify API error ${fetchReq.status}: ${text}`);
            }

            return await fetchReq.json();
        }
        catch (error) {
            console.error("FETCH REQUEST FAILED: ", error);
            throw error;
        }
    }
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