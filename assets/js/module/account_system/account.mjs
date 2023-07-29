export class account {
    db = null;
    constructor(db) {
        this.db = db;
    }

    getLists() {
        let arr = this.db.exec("SELECT `id`, `name`, `description` FROM `accountsys_account`;");
        console.log(arr['status'], arr['result']);
        return arr;
    }

    add(name, description) {
        let arr = this.db.exec("INSERT INTO `accountsys_account` (`name`, `description`) VALUES ('" + name + "', '" + description + "');");
    }
}