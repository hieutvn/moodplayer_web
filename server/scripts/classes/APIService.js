export class APIService {

    constructor(token) {

        this.token = token;
        this.baseURL = "https://api.spotify.com/";
    }

    async request(endpoint, method, options = {}) {
        try {
            const requestTo = await fetch(`${this.baseURL}${endpoint}`, {
                method: `${method}`,
                headers: {

                    Authorization: `Bearer ${token}`, ...options.headers
                },
                ...options
            })

            if (!requestTo.ok) { throw new Error("Response at APIService failed: ", requestTo.status); }

            const data = await requestTo.json();
            return data;
        }
        catch (error) {
            console.error(error);
        }
    }


    getRequest() { }
    postRequest() { }
    putRequest() { }
    deleteRequest() { }

}