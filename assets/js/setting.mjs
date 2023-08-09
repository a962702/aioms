import { database } from './module/database/main.mjs'
import { setting } from './module/setting/main.mjs'

let db = new database();
await db.init();

let s = new setting(db);
$("#setting_btn_runcommand").on('click', ()=>{
    s.exec(document.getElementById('sql_statement').value);
});

$("#btn_GDDB_auth").on("click", async () => {
    db.GD_auth();
})

$("#btn_GDDB_signout").on("click", () => {
    db.GD_signout();
})

$("#btn_GDDB_exist").on("click", () => {
    db.GD_exist();
})

$("#btn_GDDB_create").on("click", () => {
    db.GD_create();
})

$("#btn_GDDB_load").on("click", () => {
    db.GD_load();
})

$("#btn_GDDB_save").on("click", () => {
    db.GD_save();
})