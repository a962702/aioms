import { database } from './module/database/main.mjs'

let db = new database();
await db.init();

$("#authorize_button").on("click", () => {
    if (db.GD_auth()) {
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        db.GD_list();
    }
})

$("#signout_button").on("click", () => {
    db.GD_signout();
})