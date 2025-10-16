export class APIClient {

    constructor(token) {

        this.baseURL = "https://api.spotify.com/v1";
        this.token = token;
    }

    async request(endpoint, method, options = {}) {

        try {
            const fetchReq = await fetch(`${this.baseURL}/${endpoint}/${!options.headers.id ? "" : options.headers.id}`, {

                method: method,
                headers: { Authorization: 'Bearer ' + `${this.token}`, ...options.headers },
                body: (options.body) ? JSON.stringify(options.body) : undefined
            });

            if (!fetchReq.ok) throw new Error(`FETCH REQUEST ERROR: ${fetchReq.status}`);

            return fetchReq.json;

        }
        catch (error) {

            console.error("FETCH REQUEST FAILED: ", error)
            return fetchReq.status(500);
        }
    }

    setToken(token) {

        if (token !== null && typeof token === "string") { this.token = token }
        console.error("Token invalid")
    }

    getToken() { return !(token) ? null : this.token }
}