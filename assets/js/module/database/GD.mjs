export class GDDB {
    API_KEY = 'AIzaSyA4mm8XqstQJJtgv-LBSBqX2h1qICc4jz8';
    CLIENT_ID = '527148381600-n1iq0sdpepsaa76rdh8naio9b86pbh79.apps.googleusercontent.com';
    DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
    SCOPES = 'https://www.googleapis.com/auth/drive.file';
    tokenClient = null;
    fileId = "";
    token = "";
    revisions = "";

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

    getItemsFromLocalStorage() {
        if(localStorage.getItem("AIOMS_GDDB_token") && localStorage.getItem("AIOMS_GDDB_token") != ""){
            this.token = localStorage.getItem("AIOMS_GDDB_token");
        }
        if(localStorage.getItem("AIOMS_GDDB_fileId") && localStorage.getItem("AIOMS_GDDB_fileId") != ""){
            this.fileId = localStorage.getItem("AIOMS_GDDB_fileId");
        }
    }

    auth() {
        localStorage.setItem("AIOMS_GDDB_AuthStatus", "WAIT");
        this.tokenClient.callback = (resp) => {
            if (resp.error !== undefined) {
                console.log(resp);
                localStorage.setItem("AIOMS_GDDB_AuthStatus", "FAIL");
            } else {
                this.token = gapi.client.getToken().access_token;
                localStorage.setItem("AIOMS_GDDB_token", this.token);
                localStorage.setItem("AIOMS_GDDB_AuthStatus", "SUCCESS");
            }
        };
        this.tokenClient.error_callback = () => {
            localStorage.setItem("AIOMS_GDDB_AuthStatus", "FAIL");
        }
        if (gapi.client.getToken() === null) {
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            this.tokenClient.requestAccessToken({ prompt: '' });
        }
    }

    signout() {
        this.getItemsFromLocalStorage();
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
        this.getItemsFromLocalStorage();
        if (this.token != "") {
            let arr = Array();
            $.ajax({
                method: "GET",
                url: "https://www.googleapis.com/drive/v3/files?q=name = 'AIOMS.db'&trashed=false",
                headers: {
                    'Authorization': 'Bearer ' + this.token
                },
                async: false,
                success: (data) => {
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
                },
                error: () => {
                    arr['status'] = "ERROR";
                }
            })
            return arr;
        }
    }

    create() {
        this.getItemsFromLocalStorage();
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
        this.getItemsFromLocalStorage();
        if (this.token != "" && this.fileId != "") {
            let arr = Array();
            $.ajax({
                method: "GET",
                url: "https://www.googleapis.com/drive/v3/files/" + this.fileId + '?alt=media',
                headers: {
                    'Authorization': 'Bearer ' + this.token
                },
                async: false,
                success: (data) => {
                    console.log("[GDDB] Load: " + data);
                    arr['status'] = "OK";
                    arr['data'] = data;
                },
                error: () => {
                    arr['status'] = "ERROR";
                }
            })
            return arr;
        }
    }

    save(data) {
        this.getItemsFromLocalStorage();
        this.setLocalRevisionsValue("");
        if (this.token != "" && this.fileId != "") {
            console.log("[GDDB] Save: " + data);
            let arr = Array();
            $.ajax({
                method: "PATCH",
                url: "https://www.googleapis.com/upload/drive/v3/files/" + this.fileId,
                headers: {
                    'Authorization': 'Bearer ' + this.token
                },
                data: data,
                contentType: 'text/plain',
                processData: false,
                async: false,
                success: () => {
                    arr['status'] = "OK";
                    this.setLocalRevisionsValue(this.getRemoteRevisionsValue());
                },
                error: () => {
                    arr['status'] = "ERROR";
                }
            })
            return arr;
        }
    }

    setLocalRevisionsValue(revisions) {
        this.revisions = revisions;
    }

    getRemoteRevisionsValue() {
        this.getItemsFromLocalStorage();
        $.ajax({
            method: "GET",
            url: "https://www.googleapis.com/drive/v3/files/" + this.fileId + '/revisions',
            headers: {
                'Authorization': 'Bearer ' + this.token
            },
            async: false,
            success: (data) => {
                let rev_list = data['revisions'];
                let rev_id = rev_list[rev_list.length - 1]['id'];
                console.log("[GDDB] getRemoteRevisionsValue:", rev_id);
                return rev_id;
            },
            error: () => {
                return "";
            }
        })
    }

    isRevisionsChanged() {
        new_rev = this.getRemoteRevisionsValue();
        if(new_rev != "" && this.revisions != new_rev){
            return true;
        }
        return false;
    }
}