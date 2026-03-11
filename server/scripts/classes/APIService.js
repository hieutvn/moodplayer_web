export class APIService {

    constructor(token) {

        this.token = token;
        this.baseURL = "https://api.spotify.com/";
    }

    async request(endpoint, method, options = {}) {
        try {
            let headers = {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...(options.headers || {})
            };

            /*             
            if (options.body && !('Content-Type' in Object.keys(headers).reduce((o, k) =>
                            (o[k.toLowerCase()] = headers[k], o),
                            {}))) {
                            headers['Content-Type'] = 'application/json';
                        } 
                            */

            const requestTo = await fetch(`${this.baseURL}${endpoint}`, {
                method: method,
                headers,
                body: options.body ? JSON.stringify(options.body) : undefined,
            });

            if (!requestTo.ok) {
                // capture body text for debugging if available
                let errBody;
                try {
                    errBody = await requestTo.text();
                } catch (e) {
                    errBody = '<unable to read body>';
                }
                throw new Error(`Response at APIService failed: ${requestTo.status} - ${errBody}`);
            }
            const data = await requestTo.json();

            return data;
        }
        catch (error) {
            console.error('APIService.request error:', error);
            return error;
        }
    }
}