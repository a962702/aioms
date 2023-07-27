import { database } from '../database/main.mjs';

export class overview {
    db = null;
    async init() {
        this.db = new database();
        await this.db.init();
    }

    addLog(){
        let arr = this.db.exec("INSERT INTO `account_record` (`source`, `amount`, `commit`) VALUES (1,2,3)");
        console.log(arr['status'], arr['result']);
    }
    getDetails(){
        let arr = this.db.exec("SELECT `id`, `source`, `amount`, `commit` FROM `account_record`;");
        console.log(arr['status'], arr['result']);
    }
    exec(stm){
        let arr = this.db.exec(stm);
        console.log(arr['status'], arr['result']);
    }
}