import { database } from './module/database/main.mjs'
import { setting } from './module/setting/main.mjs'

let db = new database();
await db.init();

let s = new setting(db);
const loading_modal = new bootstrap.Modal('#loading_modal');

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
        $("#loading_modal").one('shown.bs.modal', () => {
            $(document).one('DB-GD_load', (status) => {
                if (status == "FAIL"){
                    window.alert("Google 驗證過程發生錯誤");
                }
                loading_modal.hide();
            })
            db.GD_load(params.get("fileid"));
        })
        loading_modal.show();
    } else {
        window.alert("連結有誤! 缺少 fileid 欄位");
    }
}