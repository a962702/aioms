import { GDDB } from './GD.mjs';
import { localDB } from './local.mjs';

export class database {
    obj_localDB = null;
    obj_GDDB = null;
    GD_sync_inverv = null;

    async init() {
        this.obj_localDB = new localDB();
        this.obj_GDDB = new GDDB();
        await this.obj_localDB.init();
        await this.obj_GDDB.init();
        if (!localStorage.getItem("AIOMS_DB_INIT")) {
            localStorage.setItem("AIOMS_DB_VER", "1");
            localStorage.setItem("AIOMS_DB_STORAGE", JSON.stringify(Array('local')));
            localStorage.setItem("AIOMS_DB_INIT", true);
            this.obj_localDB.initDB();
        }
        else {
            this.obj_localDB.load();
            if (this.get_setup_storage().includes('GD')) {  // FIXME! Should detect version changed
                $(document).one("DB-GD-load", (e, status, data) => {
                    if (status == "OK") {
                        this.obj_localDB.save(data);
                        this.obj_localDB.load();
                        $(document).one("DB-GD-getRemoteRevisionsValue", (e, status, rev_id) => {
                            if (status == "OK") {
                                this.obj_GDDB.setLocalRevisionsValue(rev_id);
                                $(document).one("DB-GD-getUserInfo", (e, status, displayName, emailAddress) => {
                                    $("#setting_GD_status").text("已連結");
                                    $("#setting_GD_user").text(displayName + " (" + emailAddress + ")");
                                    $("#btn_GDDB_connect").css("display", "none");
                                    $("#btn_GDDB_signout").css("display", "block");
                                    $("#input_GDShareLink").val("https://a962702.github.io/aioms/index.html?dbtype=GD&fileid=" + this.obj_GDDB.getId());
                                    this.GD_sync();
                                })
                                this.obj_GDDB.getUserInfo();
                            } else {
                                window.alert("無法取得 revision 值");
                            }
                        })
                        this.obj_GDDB.getRemoteRevisionsValue();
                    }
                    else {
                        window.alert("從Google 雲端硬碟下載資料庫時發生錯誤");
                        this.GD_signout();
                    }
                })
                this.obj_GDDB.load();
            } else {
                $("#setting_GD_status").text("未登入");
                $("#setting_GD_user").text("");
                $("#btn_GDDB_connect").css("display", "block");
                $("#btn_GDDB_signout").css("display", "none");
                $("#input_GDShareLink").val("");
            }
        }
    }

    // Get available storage
    get_available_storage() {
        return Array('local', 'GD');
    }

    // Get setup storage
    get_setup_storage() {
        return JSON.parse(localStorage.getItem("AIOMS_DB_STORAGE"));
    }

    // Execute SQL statement and return data
    exec(stm) {
        let arr = Array();
        if (this.obj_localDB != null) {
            arr['status'] = 'OK';
            arr['result'] = this.obj_localDB.exec(stm);
        } else {
            arr['status'] = 'ERROR_UNINITIALIZED';
        }
        return arr;
    }

    // Save all DB
    save() {
        this.obj_localDB.exec("UPDATE `system` SET `ModifiedTime` = '" + Date.now() + "'");
        let storage_count = 0;
        if (this.get_setup_storage().includes('local')) {
            this.obj_localDB.save(this.obj_localDB.get_binaryArray());
            storage_count += 1;
        }
        if (this.get_setup_storage().includes('GD')) {
            this.obj_GDDB.setLocalRevisionsValue("");
            $(document).one('DB-GD-save', (e, status) => {
                storage_count += 1;
                if (status == "OK") {
                    $(document).one("DB-GD-getRemoteRevisionsValue", (e, status, rev_id) => {
                        if (status == "OK") {
                            this.obj_GDDB.setLocalRevisionsValue(rev_id);
                        } else {
                            window.alert("無法取得 revision 值");
                        }
                    })
                    this.obj_GDDB.getRemoteRevisionsValue();
                } else {
                    window.alert("儲存資料庫至 Google 雲端硬碟時發生錯誤!");
                }
            })
            this.obj_GDDB.save(this.obj_localDB.get_binaryArray());
        }
        let save_check = setInterval(() => {
            if (storage_count == this.get_setup_storage().length) {
                clearInterval(save_check);
                $(document).trigger("DB-changed");
                $(document).trigger("DB-save");
            }
        }, 500);
    }

    // Export DB
    export() {
        let arraybuff = this.obj_localDB.get_binaryArray();
        let blob = new Blob([arraybuff]);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = window.URL.createObjectURL(blob);
        a.download = "sql.db";
        a.onclick = function () {
            setTimeout(function () {
                window.URL.revokeObjectURL(a.href);
            }, 1000);
        };
        a.click();
    }

    // Google Drive - Connect
    GD_connect() {
        $(document).one("DB-GD-auth", (e, status) => {
            if (status == "SUCCESS") {
                $(document).one("DB-GD-exist", (e, status, result) => {
                    if (status == "OK") {
                        if (result == "MULTI") {
                            window.alert("FIXME! GDDB.exist() return MULTI");
                        } else {
                            if (result == "NO") {
                                this.obj_GDDB.create();
                                window.alert("已成功連結 Google 雲端硬碟");
                            } else {
                                if (window.confirm("Google 雲端硬碟中存有資料庫，是否載入?\n[是] 使用Google 雲端硬碟中的資料庫\n[否] 使用本地資料庫")) {
                                    $(document).one("DB-GD-load", (e, status, data) => {
                                        if (status == "OK") {
                                            this.obj_localDB.save(data);
                                            this.obj_localDB.load();
                                            window.alert("從Google 雲端硬碟載入資料庫成功");
                                            $(document).one("DB-GD-getRemoteRevisionsValue", (e, status, rev_id) => {
                                                if (status == "OK") {
                                                    this.obj_GDDB.setLocalRevisionsValue(rev_id);
                                                    $(document).one("DB-GD-getUserInfo", (e, status, displayName, emailAddress) => {
                                                        $("#setting_GD_status").text("已連結");
                                                        $("#setting_GD_user").text(displayName + "(" + emailAddress + ")");
                                                        $("#btn_GDDB_connect").css("display", "none");
                                                        $("#btn_GDDB_signout").css("display", "block");
                                                        $("#input_GDShareLink").val("https://a962702.github.io/aioms/index.html?dbtype=GD&fileid=" + this.obj_GDDB.getId());
                                                        this.GD_sync();
                                                        $(document).trigger("DB-changed");
                                                    })
                                                    this.obj_GDDB.getUserInfo();
                                                } else {
                                                    window.alert("無法取得 revision 值");
                                                }
                                            })
                                            this.obj_GDDB.getRemoteRevisionsValue();
                                        }
                                        else {
                                            window.alert("從Google 雲端硬碟下載資料庫時發生錯誤");
                                        }
                                    })
                                    this.obj_GDDB.load();
                                } else {
                                    this.obj_GDDB.save(this.obj_localDB.get_binaryArray());
                                    this.GD_sync();
                                }
                            }
                            localStorage.setItem("AIOMS_DB_STORAGE", JSON.stringify(Array('local', 'GD')));
                        }
                    } else {
                        window.alert("GDDB.exist() ERROR");
                    }
                })
                this.obj_GDDB.exist();
            }
            else {
                window.alert("「連結 Google 雲端硬碟」操作已被取消");
            }
        })
        this.obj_GDDB.auth();
    }

    // Google Drive - Custom fileId for Database sharing
    GD_load(fileId) {
        this.obj_GDDB.setId(fileId);
        $(document).one("DB-GD-auth", (e, status) => {
            if (status == "SUCCESS") {
                $(document).one("DB-GD-load", (e, status, data) => {
                    if (status == "OK") {
                        this.obj_localDB.save(data);
                        this.obj_localDB.load();
                        window.alert("從Google 雲端硬碟載入資料庫成功");
                        $(document).one("DB-GD-getRemoteRevisionsValue", (e, status, rev_id) => {
                            if (status == "OK") {
                                this.obj_GDDB.setLocalRevisionsValue(rev_id);
                                $(document).one("DB-GD-getUserInfo", (e, status, displayName, emailAddress) => {
                                    $("#setting_GD_status").text("已連結");
                                    $("#setting_GD_user").text(displayName + "(" + emailAddress + ")");
                                    $("#btn_GDDB_connect").css("display", "none");
                                    $("#btn_GDDB_signout").css("display", "block");
                                    $("#input_GDShareLink").val("https://a962702.github.io/aioms/index.html?dbtype=GD&fileid=" + this.obj_GDDB.getId());
                                    localStorage.setItem("AIOMS_DB_STORAGE", JSON.stringify(Array('local', 'GD')));
                                    this.GD_sync();
                                    $(document).trigger("DB-changed");
                                    $(document).trigger("DB-GD_load", ['OK']);
                                })
                                this.obj_GDDB.getUserInfo();
                            } else {
                                window.alert("無法取得 revision 值");
                            }
                        })
                        this.obj_GDDB.getRemoteRevisionsValue();
                    }
                    else {
                        window.alert("從Google 雲端硬碟下載資料庫時發生錯誤");
                    }
                })
                this.obj_GDDB.load();
            } else {
                $(document).trigger("DB-GD_load", ['FAIL']);
            }
        })
        this.obj_GDDB.auth();
    }

    // Google Drive - Signout
    GD_signout() {
        this.obj_GDDB.signout();
        localStorage.setItem("AIOMS_DB_STORAGE", JSON.stringify(Array('local')));
        if (this.GD_sync_inverv !== null) {
            clearInterval(this.GD_sync_inverv);
        }
        $("#setting_GD_status").text("未登入");
        $("#setting_GD_user").text("");
        $("#btn_GDDB_connect").css("display", "block");
        $("#btn_GDDB_signout").css("display", "none");
        $("#input_GDShareLink").val("");
        window.alert("已中斷連結Google");
    }

    // Google Drive - Sync
    GD_sync() {
        this.GD_sync_inverv = setInterval(() => {
            $(document).one("DB-GD-getRemoteRevisionsValue", (e, status, rev_id) => {
                if (status == "OK") {
                    if (this.obj_GDDB.getLocalRevisionsValue() != "" && rev_id != this.obj_GDDB.getLocalRevisionsValue()) {
                        $(document).one("DB-GD-load", (e, status, data) => {
                            if (status == "OK") {
                                this.obj_localDB.save(data);
                                this.obj_localDB.load();
                                this.obj_GDDB.setLocalRevisionsValue(rev_id);
                                $(document).trigger("DB-changed");
                            }
                        })
                        this.obj_GDDB.load();
                    }
                } else {
                    window.alert("存取用 Token 過期，請重新登入\n提示：這是個已知的 [BUG] ，將於未來版本修復!");
                    this.GD_signout();
                }
            })
            this.obj_GDDB.getRemoteRevisionsValue();
        }, 7500);
    }

    GD_getUserInfo() {
        return this.obj_GDDB.getUserInfo();
    }
}