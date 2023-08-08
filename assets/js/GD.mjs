import { database } from './module/database/main.mjs'

let db = new database();
await db.init();

$("#authorize_button").on("click", async () => {
    if (db.GD_auth()) {
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        await db.GD_list();
    }
})

$("#signout_button").on("click", () => {
    db.GD_signout();
})

$("#load_button").on("click", () => {
    db.GD_load();
})

$("#save_button").on("click", () => {
    db.GD_save();
})

function signin_callback() {
    window.alert('Callback hit!');
}