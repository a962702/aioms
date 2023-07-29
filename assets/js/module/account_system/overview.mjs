export class overview {
    db = null;
    constructor(db){
        this.db = db;
    }

    addLog(date, source, amount, commit){
        let arr = this.db.exec("INSERT INTO `accountsys_record` (`date`, `source`, `amount`, `commit`) VALUES ('" + date + "', '" + source + "', '" + amount + "', '" + commit + "');");
        console.log(arr['status'], arr['result']);
    }
    update(){
        let arr = this.db.exec("SELECT `id`, `date`, `source`, `amount`, `commit` FROM `accountsys_record`;");
        console.log(arr['status'], arr['result']);
        return arr;
    }
}