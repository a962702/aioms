export class overview {
    db = null;
    constructor(db){
        this.db = db;
    }

    add(date, type, description, invoice, amount, commit){
        let arr = this.db.exec("INSERT INTO `accountsys_record` (`date`, `type`, `description`, `invoice`, `amount`, `commit`) VALUES ('" + date + "', '" + type + "', '" + description + "', '" + invoice + "', '" + amount + "', '" + commit + "');", true);
        console.log(arr['status'], arr['result']);
    }
    getLists(){
        let arr = this.db.exec("SELECT `id`, `date`, `type`, `description`, `invoice`, `amount`, `commit` FROM `accountsys_record`;", false);
        console.log(arr['status'], arr['result']);
        return arr;
    }
}