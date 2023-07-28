import { database } from './module/database/main.mjs'
import { overview } from './module/account_system/overview.mjs'
import { plan } from './module/account_system/plan.mjs'
import { manage } from './module/account_system/manage.mjs'

let db = new database();
await db.init();

let ov = new overview(db);
const modal = new bootstrap.Modal('#overview_modal_add');
document.getElementById("overview_modal_add_save").addEventListener('click', ()=>{
    ov.addLog(document.getElementById("overview_modal_add_date").value, document.getElementById("overview_modal_add_source").value, document.getElementById("overview_modal_add_amount").value, document.getElementById("overview_modal_add_commit").value);
    modal.hide();
});
document.getElementById("overview_btn_update").addEventListener('click', ()=>{
    let data = ov.update();
    if(data['status'] != 'OK'){
        window.alert("取得資料發生錯誤");
        return;
    }
    document.getElementById('overview_tbody').innerHTML = "";
    let result = data['result'][0]['values'];
    for (let row of result){
        let tr = document.createElement("tr");
        let td_id = document.createElement("td");
        td_id.innerText = row[0];
        tr.appendChild(td_id);
        let td_date = document.createElement("td");
        td_date.innerText = row[1];
        tr.appendChild(td_date);
        let td_source = document.createElement("td");
        td_source.innerText = row[2];
        tr.appendChild(td_source);
        let td_amount = document.createElement("td");
        td_amount.innerText = row[3];
        tr.appendChild(td_amount);
        let td_commit = document.createElement("td");
        td_commit.innerText = row[4];
        tr.appendChild(td_commit);
        document.getElementById('overview_tbody').appendChild(tr);
    }
});
console.log("overview OK");

let pla = new plan(db);
console.log("plan OK");

let manag = new manage(db);
console.log("manage OK");