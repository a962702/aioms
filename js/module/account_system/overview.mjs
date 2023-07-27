import { database } from '../database/main.mjs';

export class overview {
    db = null;
    async init() {
        this.db = new database();
    }

    addLog(){
        let arr = this.db.exec("INSERT INTO `account_record` (`source`, `amount`, `commit`) VALUES (1,2,3)");
        console.log(arr['status'], arr['result']);
    }
    getDetails(){
        let arr = this.db.exec("SELECT `source`, `amount`, `commit` FROM `account_record`;");
        console.log(arr['status'], arr['result']);
    }
}