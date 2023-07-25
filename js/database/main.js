import { localDB } from './local.js';
import { GDDB } from './GD.js';

export class database {
    localDB = null;
    GDDB = null;

    async init() {
        obj_localDB = new localDB();
        obj_localDB.init();
        if (!localStorage.getItem("AIOMS_DB_INIT")) {
            localStorage.setItem("AIOMS_DB_VER", "1");
            localStorage.setItem("AIOMS_DB_STORAGE", Array('local'));
            localStorage.setItem("AIOMS_DB_INIT", true);
            obj_localDB.initDB();
        }
        else {
            obj_localDB.load();
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
        arr = Array();
        if (this.localDB != null) {
            arr['status'] = 'OK';
            arr['result'] = this.localDB.exec(stm);
            return arr;
        }
        arr['status'] = 'ERROR_UNINITIALIZED';
        return arr;
    }

    // Save all DB
    save() {
        setup_storage = localStorage.getItem("AIOMS_DB_STORAGE");
        for (storage in setup_storage) {
            console.log("[database] Saving ", storage)
        }
    }

    // Export DB
    export() {
        arraybuff = this.localDB.get_binaryArray();
        blob = new Blob([arraybuff]);
        a = document.createElement("a");
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