export class overview {
    db = null;
    constructor(db){
        this.db = db;
    }

    add(date, type, description, invoice, amount, commit){
        this.db.exec("INSERT INTO `accountsys_record` (`date`, `type`, `description`, `invoice`, `amount`, `commit`) VALUES ('" + date + "', '" + type + "', '" + description + "', '" + invoice + "', '" + amount + "', '" + commit + "');", true);
        let arr = this.db.exec("SELECT last_insert_rowid();", false);
        return arr['result'][0]['values'][0];
    }
    getLists(){
        let arr = this.db.exec("SELECT `id`, `date`, `type`, `description`, `invoice`, `amount`, `commit` FROM `accountsys_record`;", false);
        console.log(arr['status'], arr['result']);
        return arr;
    }
}