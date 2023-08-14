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
        if (localStorage.getItem("AIOMS_GDDB_token") && localStorage.getItem("AIOMS_GDDB_token") != "") {
            this.token = localStorage.getItem("AIOMS_GDDB_token");
        }
        if (localStorage.getItem("AIOMS_GDDB_fileId") && localStorage.getItem("AIOMS_GDDB_fileId") != "") {
            this.fileId = localStorage.getItem("AIOMS_GDDB_fileId");
        }
    }

    auth() {
        this.tokenClient.callback = (resp) => {
            if (resp.error !== undefined) {
                console.log(resp);
                $(document).trigger("DB-GD-auth", ["FAIL"]);
            } else {
                this.token = gapi.client.getToken().access_token;
                localStorage.setItem("AIOMS_GDDB_token", this.token);
                $(document).trigger("DB-GD-auth", ["SUCCESS"]);
            }
        };
        this.tokenClient.error_callback = () => {
            $(document).trigger("DB-GD-auth", ["FAIL"]);
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
            $.ajax({
                method: "GET",
                url: "https://www.googleapis.com/drive/v3/files?q=name = 'AIOMS.db'&trashed=false",
                headers: {
                    'Authorization': 'Bearer ' + this.token
                },
                success: (data) => {
                    if (data.files.length == 0) {
                        $(document).trigger("DB-GD-exist", ["OK", "NO"]);
                    }
                    else if (data.files.length == 1) {
                        $(document).trigger("DB-GD-exist", ["OK", "YES"]);
                        this.setId(data.files[0].id);
                    }
                    else {
                        $(document).trigger("DB-GD-exist", ["OK", "MULTI"]);
                    }
                },
                error: () => {
                    $(document).trigger("DB-GD-exist", ["ERROR"]);
                }
            })
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
            $.ajax({
                method: "GET",
                url: "https://www.googleapis.com/drive/v3/files/" + this.fileId + '?alt=media',
                headers: {
                    'Authorization': 'Bearer ' + this.token
                },
                success: (data) => {
                    console.log("[GDDB] Load: " + data);
                    $(document).trigger("DB-GD-load", ["OK", data]);
                },
                error: () => {
                    $(document).trigger("DB-GD-load", ["ERROR"]);
                }
            })
        }
    }

    save(data) {
        this.getItemsFromLocalStorage();
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
                processData: false,
                success: () => {
                    $(document).trigger("DB-GD-save", ["OK"]);
                },
                error: () => {
                    $(document).trigger("DB-GD-save", ["ERROR"]);
                }
            })
        }
    }

    setLocalRevisionsValue(revisions) {
        console.log("[GDDB] Local Revision changed from", this.revisions, "to", revisions);
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
            success: (data) => {
                let rev_list = data['revisions'];
                let rev_id = rev_list[rev_list.length - 1]['id'];
                $(document).trigger("DB-GD-getRemoteRevisionsValue", ["OK", rev_id]);
            },
            error: () => {
                $(document).trigger("DB-GD-getRemoteRevisionsValue", ["ERROR"]);
            }
        })
    }

    getLocalRevisionsValue() {
        return this.revisions;
    }

    getUserInfo() {
        this.getItemsFromLocalStorage();
        let result = Array();
        $.ajax({
            method: "GET",
            url: "https://www.googleapis.com/drive/v3/about?fields=user",
            headers: {
                'Authorization': 'Bearer ' + this.token
            },
            success: (data) => {
                $(document).trigger("DB-GD-getUserInfo", ["OK", data['user']['displayName'], data['user']['emailAddress']]);
            },
            error: () => {
                $(document).trigger("DB-GD-getUserInfo", ["ERROR"]);
            }
        })
        return result;
    }
}