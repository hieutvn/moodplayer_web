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

                switch (request.status) {
                    case 401:
                        throw new Error("Unauthorized: Invalid or expired access token", request.statusText);
                    case 403:
                        throw new Error("Forbidden: Access denied", request.statusText);
                    case 404:
                        throw new Error("Not Found: The requested resource could not be found", request.statusText);
                    case 500:
                        throw new Error("Internal Server Error", request.statusText);
                    case 502:
                        throw new Error("Bad Gateway", request.statusText);
                    case 503:
                        throw new Error("Service Unavailable", request.statusText);
                    default:
                        throw new Error("An error occurred in the API Service", request.statusText);
                }
            }

            const response = await request.json();
            return response;
        }
        catch (error) {
            console.error('APIService.request error:', error.message);
            return error;
        }
    }
}