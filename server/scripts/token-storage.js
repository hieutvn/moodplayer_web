class TokenStorage {

    constructor() {

        this.access_token = null;
        this.refresh_token = null;
        this.expires_in = null;
    }

    countExpiry(expires_in) {

        
    }

    storeToken(token) {

        if (token !== null) token = this.token;
        console.error("Cannot store token");
    }

    getToken() { return (this.token !== null) ? this.token : null }
    getRefreshToken() { return (this.refresh_token !== null) ? this.refresh_token : null }

}