let token = null;

onmessage = function (event) {

    const { action, payload } = event.data;

    switch (action) {

        case 'getToken':
            this.postMessage({ action: 'token', token });
            break;

        case 'setToken':
            token = payload;
            break;

        case 'clearToken':
            token = null;
            this.postMessage({ action: 'tokenCleard' });
            break;

        default:
            console.error("Unknown action");
    }
};

