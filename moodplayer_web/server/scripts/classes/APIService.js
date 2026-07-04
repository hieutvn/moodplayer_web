export class APIService {

    constructor(token) {

        this.token = token;
        this.baseURL = "https://api.spotify.com/";
    }

    async request(endpoint, method, options = {}) {
        try {

            const request = await fetch(`${this.baseURL}${endpoint}`, {
                method: method,
                body: options.body ? JSON.stringify(options.body) : undefined,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                },
            });

            if (!request.ok) {
                throw new Error("An error accured in the API Service", request.status)
            }

            const response = await request.json();
            return response;
        }
        catch (error) {
            console.error('APIService.request error:', error);
            return error;
        }
    }
}