import { database } from './module/database/main.mjs'
import { setting } from './module/setting/main.mjs'

let db = new database();
await db.init();

let s = new setting(db);
$("#setting_btn_runcommand").on('click', ()=>{
    s.exec(document.getElementById('sql_statement').value);
});

$("#btn_GDDB_auth").on("click", async () => {
    if (db.GD_auth()) {
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        await db.GD_list();
    }
})

$("#btn_GDDB_signout").on("click", () => {
    db.GD_signout();
})

$("#btn_GDDB_load").on("click", () => {
    db.GD_load();
})

$("#btn_GDDB_save").on("click", () => {
    db.GD_save();
})