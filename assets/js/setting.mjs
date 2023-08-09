import { database } from './module/database/main.mjs'
import { setting } from './module/setting/main.mjs'

let db = new database();
await db.init();

let s = new setting(db);
$("#setting_btn_runcommand").on('click', ()=>{
    s.exec(document.getElementById('sql_statement').value);
});

$("#btn_GDDB_connect").on("click", async () => {
    db.GD_connect();
})

$("#btn_GDDB_signout").on("click", () => {
    db.GD_signout();
})
