export class localDB {
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
        while(!this.SQL);
        console.log("[localDB] exec: ", stm);
        let result = this.db.exec(stm);
        return result;
    }

    /***** Init Database *****/
    initDB() {
        console.log("[localDB] initDB");
        this.db = new this.SQL.Database();
        let command = `
            CREATE TABLE 'accountsys_record' (
                'id' INTEGER NOT NULL PRIMARY KEY,
                'date' TEXT NOT NULL,
                'type' INTEGER NOT NULL,
                'description' INTEGER NOT NULL,
                'invoice' TEXT,
                'amount' INTEGER NOT NULL,
                'commit' TEXT
            );
            CREATE TABLE 'accountsys_account' (
                'id' INTEGER NOT NULL PRIMARY KEY,
                'name' TEXT NOT NULL,
                'amount' INTEGER NOT NULL,
                'description' TEXT
            );
            CREATE TABLE 'accountsys_account_transaction' (
                'id' INTEGER NOT NULL PRIMARY KEY,
                'account_id' INTEGER NOT NULL,
                'record_id' INTEGER NOT NULL,
                'type' INTEGER NOT NULL,
                'amount' INTEGER NOT NULL
            );`
        this.db.run(command);
        this.save(this.get_binaryArray());
    }

    /***** Load Database *****/
    load() {
        console.log("[localDB] load");
        if(!localStorage.getItem("AIOMS_DB_local_data")){
            console.log("[localDB] load: Error while getItem('AIOMS_DB_local_data')");
            return;
        }
        const binaryArray = new Uint8Array(JSON.parse(localStorage.getItem("AIOMS_DB_local_data")));
        this.db = new this.SQL.Database(binaryArray);
    }

    /***** Save Database *****/
    save(data) {
        console.log("[localDB] Save: " + data);
        localStorage.setItem("AIOMS_DB_local_data", JSON.stringify(Array.from(data)));
    }

    /***** Get DB binaryArray *****/
    get_binaryArray() {
        console.log("[localDB] get_binaryArray");
        return this.db.export();
    }
}