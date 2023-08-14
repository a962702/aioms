export class account {
    db = null;
    constructor(db) {
        this.db = db;
    }

    add(name, description, amount) {
        this.db.exec("INSERT INTO `accountsys_account` (`name`, `description`, `amount`) VALUES ('" + name + "', '" + description + "', '" + amount + "');", true);
    }

    add_transaction(account_id, record_id, type, amount){
        this.db.exec("INSERT INTO `accountsys_account_transaction` (`account_id`, `record_id`, `type`, `amount`) VALUES ('" + account_id + "', '" + record_id + "', '" + type + "', '" + amount + "');", true);
    }

    getLists() {
        let arr = this.db.exec("SELECT `id`, `name`, `description`, `amount` FROM `accountsys_account`;", false);
        console.log(arr['status'], arr['result']);
        return arr;
    }
}