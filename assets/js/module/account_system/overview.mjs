export class overview {
    db = null;
    constructor(db) {
        this.db = db;
    }

    add(date, type, description, invoice, amount, commit) {
        let arr = this.db.exec("INSERT INTO `accountsys_record` (`date`, `type`, `description`, `invoice`, `amount`, `commit`) VALUES ('" + date + "', '" + type + "', '" + description + "', '" + invoice + "', '" + amount + "', '" + commit + "'); SELECT last_insert_rowid();", true);
        return arr['result'][0]['values'][0][0];
    }

    del(id) {
        let arr = this.db.exec("DELETE FROM `accountsys_record` WHERE `id` = '" + id + "';", true);
        console.log(arr['status'], arr['result']);
    }

    getDetail(id) {
        let arr = this.db.exec("SELECT `date`, `type`, `description`, `invoice`, `amount`, `commit` FROM `accountsys_record` WHERE `id` = '" + id + "';", false);
        console.log(arr['status'], arr['result']);
        return arr;
    }

    getLists(start_date, end_date) {
        let arr = this.db.exec("SELECT `id`, `date`, `type`, `description`, `amount` FROM `accountsys_record` WHERE `date` BETWEEN '" + start_date + "' AND '" + end_date + "';", false);
        console.log(arr['status'], arr['result']);
        return arr;
    }

    update(id, date, type, description, invoice, amount, commit) {
        let arr = this.db.exec("UPDATE `accountsys_record` SET `date` = '" + date + "', `type` = '" + type + "', `description` = '" + description + "', `invoice` = '" + invoice + "', `amount` = '" + amount + "', `commit` = '" + commit + "' WHERE `id` = '" + id + "';", true);
        console.log(arr['status'], arr['result']);
    }
}