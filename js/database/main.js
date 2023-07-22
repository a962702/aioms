// Layer for generic database access
import { localDB } from './local.js';

class database {
    localDB = null;
    GDDB = null;

    async init() {
        obj_localDB = new localDB();
        if (!localStorage.getItem("AIOMS_INITDB")){
            // TODO
        }
    }

    // Get available storage
    get_available_storage(){
        return Array('local', 'GD');
    }

    // Get setup storage
    get_setup_storage(){
        return Array('local');
    }

    // Execute SQL statement and return data
    exec(stm){
        arr = Array();
        if(this.localDB != null){
            arr['status'] = 'OK';
            arr['result'] = this.localDB.exec(stm);
            return arr;
        }
        arr['status'] = 'ERROR_UNINITIALIZED';
        return arr;
    }

    // Save all DB
    save(){
        setup_storage = localStorage.getItem("AIOMS_STORAGE");
        // TODO
    }

    // Export DB
    export(){
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