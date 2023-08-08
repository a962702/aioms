export class GDDB {
    API_KEY = 'AIzaSyA4mm8XqstQJJtgv-LBSBqX2h1qICc4jz8';
    CLIENT_ID = '527148381600-n1iq0sdpepsaa76rdh8naio9b86pbh79.apps.googleusercontent.com';
    DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
    SCOPES = 'https://www.googleapis.com/auth/drive.file';
    tokenClient = null;
    fileId = "13d62lfGR37KFei7zIwZQOtiUf_k3hVvE"; //TODO

    async init() {
        while (!gapi || !google);
        await gapi.load('client', async () => {
            await gapi.client.init({
                apiKey: this.API_KEY,
                discoveryDocs: [this.DISCOVERY_DOC]
            });
        });
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: this.CLIENT_ID,
            scope: this.SCOPES
        });
    }

    auth() {
        this.tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                console.log(resp);
                return false;
            }
        };
        if (gapi.client.getToken() === null) {
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            this.tokenClient.requestAccessToken({ prompt: '' });
        }
        return true;
    }

    signout() {
        let token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
        }
    }

    async list() {
        let response = await gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': 'files(id, name)',
        });
        console.log(response);
    }

    async create() {
        let response = await gapi.client.drive.files.create({
            'name': 'AIOMS.db'
        });
        console.log(response);
    }

    async load() {
        $.ajax({
            method: "GET",
            url: "https://www.googleapis.com/drive/v3/files/" + this.fileId + '?alt=media',
            headers: {
                'Authorization': 'Bearer ' + gapi.client.getToken().access_token
            }
        })
    }

    async save(data) {
        $.ajax({
            method: "PATCH",
            url: "https://www.googleapis.com/upload/drive/v3/files/" + this.fileId,
            headers: {
                'Authorization': 'Bearer ' + gapi.client.getToken().access_token
            },
            data: data,
            contentType: 'text/plain',
            processData: false
        })
    }
}