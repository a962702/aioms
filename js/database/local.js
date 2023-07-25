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
    get_binaryArray(){
        return this.db.export();
    }
}

export {
    localDB
}