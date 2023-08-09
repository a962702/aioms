import { GDDB } from './GD.mjs';
import { localDB } from './local.mjs';

export class database {
    obj_localDB = null;
    obj_GDDB = null;

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
    exec(stm) {
        let arr = Array();
        if (this.obj_localDB != null) {
            arr['status'] = 'OK';
            arr['result'] = this.obj_localDB.exec(stm);
            return arr;
        }
        arr['status'] = 'ERROR_UNINITIALIZED';
        this.save();
        return arr;
    }

    // Save all DB
    save() {
        if (get_setup_storage().includes('local')){
            this.obj_localDB.save(this.obj_localDB.get_binaryArray());
        }
        if (get_setup_storage().includes('GD')){
            this.obj_GDDB.save(this.obj_localDB.get_binaryArray());
        }
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
        localStorage.setItem("AIOMS_GDDB_AuthStatus", "START");
        this.obj_GDDB.auth();
        let auth_check = setInterval(() => {
            if(localStorage.getItem("AIOMS_GDDB_AuthStatus") == "START" || localStorage.getItem("AIOMS_GDDB_AuthStatus") == "WAIT")
                return;
            if(localStorage.getItem("AIOMS_GDDB_AuthStatus") == "SUCCESS"){
                clearInterval(auth_check);
                let arr = this.obj_GDDB.exist();
                if(arr['status'] == "OK"){
                    if (arr['result'] == "MULTI"){
                    window.alert("FIXME! exist return MULTI");
                    } else {
                        if(arr['result'] == "NO"){
                            this.obj_GDDB.create();
                        } else {
                            if(window.confirm("Google 雲端硬碟中存有資料庫，是否載入?\n[是] 使用Google 雲端硬碟中的資料庫\n[否] 使用本地資料庫")){
                                let res = this.obj_GDDB.load();
                                if(res['status'] == "OK"){
                                    this.obj_localDB.save(res['data']);
                                }
                                else if (res['status'] == "ERROR"){
                                    window.alert("從Google 雲端硬碟下載資料庫時發生錯誤");
                                }
                            }
                        }
                        localStorage.setItem("AIOMS_DB_STORAGE", Array('local', 'GD'));
                    }
                }
            } else {
                clearInterval(auth_check);
                window.alert("「連結 Google 雲端硬碟」操作已被取消");
            }
        }, 500);
    }

    // Google Drive - Signout
    GD_signout(){
        this.obj_GDDB.signout();
        localStorage.setItem("AIOMS_DB_STORAGE", Array('local'));
    }
}