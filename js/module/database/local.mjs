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
        this.load();
        console.log("[localDB] exec: ", stm);
        let result = this.db.exec(stm);
        this.save();
        return result;
    }

    /***** Init Database *****/
    initDB() {
        console.log("[localDB] initDB");
        this.db = new this.SQL.Database();
        let command = `
            CREATE TABLE 'account_record' (
                'id' INTEGER NOT NULL PRIMARY KEY,
                'date' TEXT NOT NULL,
                'source' INTEGER NOT NULL,
                'amount' INTEGER NOT NULL,
                'commit' TEXT(50)
            );`
        this.db.run(command);
        this.save();
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
    save() {
        console.log("[localDB] save");
        const binaryArray = this.db.export();
        localStorage.setItem("AIOMS_DB_local_data", JSON.stringify(Array.from(binaryArray)));
    }

    /***** Get DB binaryArray *****/
    get_binaryArray() {
        console.log("[localDB] get_binaryArray");
        return this.db.export();
    }
}