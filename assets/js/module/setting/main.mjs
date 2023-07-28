export class setting {
    db = null;
    constructor(db){
        this.db = db;
    }

    exec(stm){
        let arr = this.db.exec(stm);
        console.log(arr['status'], arr['result']);
    }
}