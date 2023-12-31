export class account {
    db = null;
    constructor(db) {
        this.db = db;
    }

    add(name, description, amount) {
        this.db.exec("INSERT INTO `accountsys_account` (`name`, `description`, `amount`) VALUES ('" + name + "', '" + description + "', '" + amount + "');");
        this.db.save();
    }

    add_transaction(arr) {
        for (let item of arr) {
            let account_id = item['account_id'];
            let record_id = item['record_id'];
            let type = item['type'];
            let amount = item['amount'];
            this.db.exec("INSERT INTO `accountsys_account_transaction` (`account_id`, `record_id`, `type`, `amount`) VALUES ('" + account_id + "', '" + record_id + "', '" + type + "', '" + amount + "');");
            let arr = this.db.exec("SELECT `amount` FROM `accountsys_account` WHERE `id` = '" + account_id + "';");
            let new_amount = parseInt(arr['result'][0]['values'][0]);
            if (type == "1") {
                new_amount -= parseInt(amount);
            } else {
                new_amount += parseInt(amount);
            }
            this.db.exec("UPDATE `accountsys_account` SET `amount` = '" + new_amount + "' WHERE `id` = '" + account_id + "';");
        }
        this.db.save();
    }

    getLists() {
        let arr = this.db.exec("SELECT `id`, `name`, `description`, `amount` FROM `accountsys_account`;");
        console.log(arr['status'], arr['result']);
        return arr;
    }

    getRecordTransaction(record_id) {
        let arr = this.db.exec("SELECT accountsys_account.`name`, accountsys_account_transaction.`amount` FROM accountsys_account_transaction INNER JOIN accountsys_account ON accountsys_account_transaction.`account_id` = accountsys_account.`id` WHERE accountsys_account_transaction.`record_id` = '" + record_id + "';");
        console.log(arr['status'], arr['result']);
        return arr;
    }

    getTransaction(account_id) {
        let arr = this.db.exec("SELECT accountsys_record.`date`, accountsys_record.`description`, accountsys_account_transaction.`type`, accountsys_account_transaction.`amount` FROM accountsys_account_transaction INNER JOIN accountsys_record ON accountsys_account_transaction.`record_id` = accountsys_record.`id` WHERE accountsys_account_transaction.`account_id` = '" + account_id + "';");
        console.log(arr['status'], arr['result']);
        return arr;
    }

    update(id, name, description, amount) {
        this.db.exec("UPDATE `accountsys_account` SET `name` = '" + name + "', `description` = '" + description + "', `amount` = '" + amount + "' WHERE `id` = '" + id + "';");
        this.db.save();
    }
}