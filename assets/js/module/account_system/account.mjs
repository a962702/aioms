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

    getTransaction(account_id) {
        let arr = this.db.exec("SELECT accountsys_record.`date`, accountsys_record.`description`, accountsys_account_transaction.`type`, accountsys_account_transaction.`amount` FROM accountsys_account_transaction INNER JOIN accountsys_record ON accountsys_account_transaction.`record_id` = accountsys_record.`id` WHERE accountsys_account_transaction.`account_id` = '" + account_id + "';", false);
        console.log(arr['status'], arr['result']);
        return arr;
    }

    update(id, name, description, amount) {
        let arr = this.db.exec("UPDATE `accountsys_account` SET `name` = '" + name + "', `description` = '" + description + "', `amount` = '" + amount + "' WHERE `id` = '" + id + "';", true);
        console.log(arr['status'], arr['result']);
    }
}