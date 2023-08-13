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
            localStorage.setItem("AIOMS_DB_STORAGE", Array('local'));
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
                            if (status == "OK"){
                                this.obj_GDDB.setLocalRevisionsValue(rev_id);
                                this.GD_sync();
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
            }
        }
    }

    // Get available storage
    get_available_storage() {
        return Array('local', 'GD');
    }

    // Get setup storage
    get_setup_storage() {
        return localStorage.getItem("AIOMS_DB_STORAGE");
    }

    // Execute SQL statement and return data
    exec(stm, isUpdate) {
        let arr = Array();
        if (this.obj_localDB != null) {
            arr['status'] = 'OK';
            arr['result'] = this.obj_localDB.exec(stm);
            if (isUpdate) {
                this.obj_localDB.exec("UPDATE `system` SET `ModifiedTime` = '" + Date.now() + "'");
                this.save();
            }
        } else {
            arr['status'] = 'ERROR_UNINITIALIZED';
        }
        return arr;
    }

    // Save all DB
    save() {
        let storage_count = 0;
        if (this.get_setup_storage().includes('local')) {
            this.obj_localDB.save(this.obj_localDB.get_binaryArray());
            storage_count += 1;
        }
        if (this.get_setup_storage().includes('GD')) {
            $(document).one('DB-GD-save', (e, status) => {
                storage_count += 1;
                if (status != "OK"){
                    window.alert("儲存資料庫至 Google 雲端硬碟時發生錯誤!");
                }
            })
            this.obj_GDDB.save(this.obj_localDB.get_binaryArray());
        }
        let save_check = setInterval(() => {
            if (storage_count == this.get_setup_storage().length){
                clearInterval(save_check);
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
                                                    this.GD_sync();
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
                            localStorage.setItem("AIOMS_DB_STORAGE", Array('local', 'GD'));
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

    // Google Drive - Signout
    GD_signout() {
        this.obj_GDDB.signout();
        localStorage.setItem("AIOMS_DB_STORAGE", Array('local'));
        if (this.GD_sync_inverv !== null) {
            clearInterval(this.GD_sync_inverv);
        }
        window.alert("已中斷連結Google");
    }

    // Google Drive - Sync
    GD_sync() {
        this.GD_sync_inverv = setInterval(() => {
            $(document).one("DB-GD-getRemoteRevisionsValue", (e, status, rev_id) => {
                if (status == "OK" && this.obj_GDDB.getLocalRevisionsValue() != "" && rev_id != this.obj_GDDB.getLocalRevisionsValue()) {
                    $(document).one("DB-GD-load", (e, status, data) => {
                        if (status == "OK") {
                            this.obj_localDB.save(data);
                            this.obj_localDB.load();
                            this.obj_GDDB.setLocalRevisionsValue(rev_id);
                        }
                    })
                    this.obj_GDDB.load();
                }
            })
            this.obj_GDDB.getRemoteRevisionsValue();
        }, 7500);
    }

    GD_getUserInfo() {
        return this.obj_GDDB.getUserInfo();
    }
}