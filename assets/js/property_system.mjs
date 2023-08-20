import { database } from './module/database/main.mjs'
import { setting } from './module/setting/main.mjs'

let db = new database();
await db.init();

let s = new setting(db);

$("#setting_btn_runcommand").on('click', () => {
    s.exec($('#sql_statement').val());
});

$("#btn_GDDB_connect").on("click", () => {
    db.GD_connect();
})

$("#btn_GDDB_signout").on("click", () => {
    db.GD_signout();
})

/***** General *****/

function chg_page() {
    if (location.hash === "#" || location.hash === "")
        location.hash = "#overview";
    $(".pages").css("display", "none");
    if (location.hash === "#overview") {
        $("#overview").css("display", "block");
    }
}
chg_page();

$(window).on('hashchange', () => {
    chg_page();
});
