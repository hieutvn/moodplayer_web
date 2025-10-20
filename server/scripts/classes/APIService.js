export class APIService {

    constructor(token) {

        this.token = token;
        this.baseURL = "https://api.spotify.com/";
    }

    async request(endpoint, method, options = {}) {
        try {
            // Build headers, merging optional headers if provided
            let headers = {
                Authorization: `Bearer ${this.token}`,
                ...(options.headers || {})
            };

            // If there's a body and no content-type set, default to JSON
            if (options.body && !('Content-Type' in Object.keys(headers).reduce((o, k) => (o[k.toLowerCase()] = headers[k], o), {}))) {
                headers['Content-Type'] = 'application/json';
            }

            const requestTo = await fetch(`${this.baseURL}${endpoint}`, {
                method: method,
                headers,
                body: options.body ? JSON.stringify(options.body) : undefined,
            });

            if (!requestTo.ok) { throw new Error(`Response at APIService failed: ${requestTo.status}`); }
            const data = await requestTo.json();
            
            return data;    
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }


    getRequest() { }
    postRequest() { }
    putRequest() { }
    deleteRequest() { }

}