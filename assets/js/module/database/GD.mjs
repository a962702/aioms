export class GDDB {
    API_KEY = 'AIzaSyA4mm8XqstQJJtgv-LBSBqX2h1qICc4jz8';
    CLIENT_ID = '527148381600-n1iq0sdpepsaa76rdh8naio9b86pbh79.apps.googleusercontent.com';
    DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
    SCOPES = 'https://www.googleapis.com/auth/drive.file';
    tokenClient = null;
    fileId = "";

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

    setId(id) {
        this.fileId = id;
    }

    exist() {
        let token = gapi.client.getToken();
        if (token !== null) {
            $.ajax({
                method: "GET",
                url: "https://www.googleapis.com/drive/v3/files?q=name = 'AIOMS.db'&trashed=false",
                headers: {
                    'Authorization': 'Bearer ' + token.access_token
                }
            }).done((data) => {
                let arr = Array();
                arr['status'] = "OK";
                if (data.files.length == 0) {
                    arr['result'] = "NO";
                }
                else if (data.files.length == 1) {
                    arr['result'] = "YES";
                    this.setId(data.files[0].id);
                }
                else {
                    arr['result'] = "MULTI";
                }
                return arr;
            }).fail(() => {
                let arr = Array();
                arr['status'] = "ERROR";
                return arr;
            })
        }
    }

    create() {
        let token = gapi.client.getToken();
        if (token !== null) {
            $.ajax({
                method: "POST",
                url: "https://www.googleapis.com/drive/v3/files",
                headers: {
                    'Authorization': 'Bearer ' + token.access_token
                },
                data: JSON.stringify({
                    name: "AIOMS.db"
                }),
                contentType: "application/json"
            }).done((data) => {
                let arr = Array();
                arr['status'] = "OK";
                arr['id'] = data.id;
                return arr;
            }).fail(() => {
                let arr = Array();
                arr['status'] = "ERROR";
                return arr;
            })
        }
    }

    load() {
        let token = gapi.client.getToken();
        if (token !== null && this.fileId != "") {
            $.ajax({
                method: "GET",
                url: "https://www.googleapis.com/drive/v3/files/" + this.fileId + '?alt=media',
                headers: {
                    'Authorization': 'Bearer ' + token.access_token
                }
            }).done((data) => {
                console.log("[GDDB] Load: " + data);
                let arr = Array();
                arr['status'] = "OK";
                arr['data'] = data;
                return arr;
            }).fail(() => {
                let arr = Array();
                arr['status'] = "ERROR";
                return arr;
            })
        }
    }

    save(data) {
        let token = gapi.client.getToken();
        if (token !== null && this.fileId != "") {
            console.log("[GDDB] Save: " + data);
            $.ajax({
                method: "PATCH",
                url: "https://www.googleapis.com/upload/drive/v3/files/" + this.fileId,
                headers: {
                    'Authorization': 'Bearer ' + token.access_token
                },
                data: data,
                contentType: 'text/plain',
                processData: false
            }).done(() => {
                let arr = Array();
                arr['status'] = "OK";
                return arr;
            }).fail(() => {
                let arr = Array();
                arr['status'] = "ERROR";
                return arr;
            })
        }
    }
}