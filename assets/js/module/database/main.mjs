import { GDDB } from './GD.mjs';
import { localDB } from './local.mjs';

export class database {
    obj_localDB = null;
    obj_GDDB = null;

    async init() {
        this.obj_localDB = new localDB();
        this.obj_GDDB = new GDDB();
        await this.obj_localDB.init();
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
        return arr;
    }

    // Save all DB
    save() {
        let setup_storage = localStorage.getItem("AIOMS_DB_STORAGE");
        for (storage in setup_storage) {
            console.log("[database] Saving ", storage)
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
}