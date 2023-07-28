import { database } from './module/database/main.mjs'
import { setting } from './module/setting/main.mjs'

let db = new database();
await db.init();

let s = new setting(db);
document.getElementById("setting_btn_runcommand").addEventListener('click', ()=>{
    s.exec(document.getElementById('sql_statement').value);
});