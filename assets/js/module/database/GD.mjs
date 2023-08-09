export class GDDB {
    API_KEY = 'AIzaSyA4mm8XqstQJJtgv-LBSBqX2h1qICc4jz8';
    CLIENT_ID = '527148381600-n1iq0sdpepsaa76rdh8naio9b86pbh79.apps.googleusercontent.com';
    DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
    SCOPES = 'https://www.googleapis.com/auth/drive.file';
    tokenClient = null;
    fileId = "";
    token = "";

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
        if(localStorage.getItem("AIOMS_GDDB_token") && localStorage.getItem("AIOMS_GDDB_token") != ""){
            this.token = localStorage.getItem("AIOMS_GDDB_token");
        }
        if(localStorage.getItem("AIOMS_GDDB_fileId") && localStorage.getItem("AIOMS_GDDB_fileId") != ""){
            this.fileId = localStorage.getItem("AIOMS_GDDB_fileId");
        }
    }

    auth() {
        this.tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                console.log(resp);
                return false;
            } else {
                this.token = gapi.client.getToken().access_token;
                localStorage.setItem("AIOMS_GDDB_token", this.token);
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
        if (this.token != "") {
            google.accounts.oauth2.revoke(this.token);
            gapi.client.setToken('');
            this.token = "";
            localStorage.setItem("AIOMS_GDDB_token", "");
        }
    }

    setId(id) {
        this.fileId = id;
        localStorage.setItem("AIOMS_GDDB_fileId", this.fileId);
    }

    exist() {
        if (this.token != "") {
            $.ajax({
                method: "GET",
                url: "https://www.googleapis.com/drive/v3/files?q=name = 'AIOMS.db'&trashed=false",
                headers: {
                    'Authorization': 'Bearer ' + this.token
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
        if (this.token != "") {
            $.ajax({
                method: "POST",
                url: "https://www.googleapis.com/drive/v3/files",
                headers: {
                    'Authorization': 'Bearer ' + this.token
                },
                data: JSON.stringify({
                    name: "AIOMS.db"
                }),
                contentType: "application/json"
            }).done((data) => {
                this.setId(data.id);
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
        if (this.token != "" && this.fileId != "") {
            $.ajax({
                method: "GET",
                url: "https://www.googleapis.com/drive/v3/files/" + this.fileId + '?alt=media',
                headers: {
                    'Authorization': 'Bearer ' + this.token
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
        if (this.token != "" && this.fileId != "") {
            console.log("[GDDB] Save: " + data);
            $.ajax({
                method: "PATCH",
                url: "https://www.googleapis.com/upload/drive/v3/files/" + this.fileId,
                headers: {
                    'Authorization': 'Bearer ' + this.token
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