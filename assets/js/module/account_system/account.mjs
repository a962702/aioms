export class account {
    db = null;
    constructor(db) {
        this.db = db;
    }

    add(name, description, amount) {
        let arr = this.db.exec("INSERT INTO `accountsys_account` (`name`, `description`, `amount`) VALUES ('" + name + "', '" + description + "', '" + amount + "');");
    }

    getLists() {
        let arr = this.db.exec("SELECT `id`, `name`, `description`, `amount` FROM `accountsys_account`;");
        console.log(arr['status'], arr['result']);
        return arr;
    }
}