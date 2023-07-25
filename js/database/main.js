class localDB {
    SQL = null;
    db = null;
    /***** Init Database *****/
    async init() {
        initSqlJs = window.initSqlJs;
        this.SQL = await initSqlJs({
            locateFile: file => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm'
        });
    }

    /***** Execute Command *****/
    exec(stm) {
        this.db.run(stm);
    }

    /***** Init Database *****/
    initDB() {
        this.db = new this.SQL.Database();
        let command = `
            CREATE TABLE 'record' (
                'id' INT(20) NOT NULL,
                'source' INT NOT NULL,
                'amount' INT NOT NULL,
                'commit' TEXT(50),
                PRIMARY KEY ('id')
            );
            CREATE TABLE 'overview' (
                'name' TEXT(50) NOT NULL,
                'updated_at' DATETIME NOT NULL
            );
            CREATE TABLE 'personnel' (
                'id' INT(20) NOT NULL,
                'name' INT(20) NOT NULL,
                PRIMARY KEY ('id')
            );`
        db.run(command);
    }

    /***** Load Database *****/
    load() {
        const binaryArray = localStorage.getItem("AIOMS_DB_local_data");
        this.db = new this.SQL.Database(binaryArray);
    }

    /***** Save Database *****/
    save() {
        const binaryArray = this.db.export();
        localStorage.setItem("AIOMS_DB_local_data", binaryArray);
    }

    /***** Get DB binaryArray *****/
    get_binaryArray() {
        return this.db.export();
    }
}

class GDDB {
    //TODO
}

class database {
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