import { database } from './module/database/main.mjs'
import { setting } from './module/setting/main.mjs'

let db = new database();
await db.init();

let s = new setting(db);
const load_GDDB_modal = new bootstrap.Modal('#load_GDDB_modal');

$("#setting_btn_runcommand").on('click', () => {
    s.exec($('#sql_statement').val());
});

$("#btn_GDDB_connect").on("click", () => {
    db.GD_connect();
})

$("#btn_GDDB_signout").on("click", () => {
    db.GD_signout();
})

// Database sharing
let params = new URL(document.location).searchParams;
//  -> Google Drive
if (params.get("dbtype") == "GD"){
    if (params.get("fileid") != null){
        $("#load_GDDB_fileid").text(params.get("fileid"));
        load_GDDB_modal.show();
        $("#load_GDDB_btn").on('click', () => {
            $("#load_GDDB_modal_step1").css("display", "none");
            $("#load_GDDB_modal_step2").css("display", "block");
            db.GD_load($("#load_GDDB_fileid").text());
            $(document).one('DB-GD_load', () => {
                load_GDDB_modal.hide();
            })
        })
    } else {
        window.alert("連結有誤! 缺少 fileid 欄位");
    }
}