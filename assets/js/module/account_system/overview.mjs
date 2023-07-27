import { database } from '../database/main.mjs';

export class overview {
    db = null;
    async init() {
        this.db = new database();
        await this.db.init();
    }

    addLog(date, source, amount, commit){
        let arr = this.db.exec("INSERT INTO `account_record` (`date`, `source`, `amount`, `commit`) VALUES ('" + date + "', '" + source + "', '" + amount + "', '" + commit + "');");
        console.log(arr['status'], arr['result']);
    }
    update(){
        let arr = this.db.exec("SELECT `id`, `date`, `source`, `amount`, `commit` FROM `account_record`;");
        console.log(arr['status'], arr['result']);
        return arr;
    }
    exec(stm){
        let arr = this.db.exec(stm);
        console.log(arr['status'], arr['result']);
    }
}