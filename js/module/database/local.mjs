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
        //this.load();
        console.log("[localDB] exec: ", stm);
        this.db.run(stm);
        this.save();
    }

    /***** Init Database *****/
    initDB() {
        console.log("[localDB] initDB");
        this.db = new this.SQL.Database();
        let command = `
            CREATE TABLE 'account_record' (
                'id' INT(20) NOT NULL,
                'source' INT NOT NULL,
                'amount' INT NOT NULL,
                'commit' TEXT(50),
                PRIMARY KEY ('id')
            );
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
        const binaryArray = localStorage.getItem("AIOMS_DB_local_data");
        this.db = new this.SQL.Database(binaryArray);
    }

    /***** Save Database *****/
    save() {
        console.log("[localDB] save");
        const binaryArray = this.db.export();
        localStorage.setItem("AIOMS_DB_local_data", binaryArray);
    }

    /***** Get DB binaryArray *****/
    get_binaryArray() {
        console.log("[localDB] get_binaryArray");
        return this.db.export();
    }
}