// https://127.0.0.1:3000/api/
// https://api.spotify.com/v1/

export class APIService {

    constructor(token, baseURL) {

        this.token = token;
        this.baseURL = baseURL;
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