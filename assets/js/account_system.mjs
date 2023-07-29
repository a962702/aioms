import { database } from './module/database/main.mjs'
import { overview } from './module/account_system/overview.mjs'
import { plan } from './module/account_system/plan.mjs'
import { manage } from './module/account_system/manage.mjs'

let db = new database();
await db.init();

let ov = new overview(db);
const modal = new bootstrap.Modal('#overview_modal_add');

document.getElementById("overview_add_modal_add_btn").addEventListener('click', () => {
    let tr = document.createElement("tr");
    tr.className = "overview_modal_add_tr";
    let td_source = document.createElement("td");
    let sel = document.createElement("select");
    sel.className = "form-select";
    td_source.appendChild(sel);
    tr.appendChild(td_source);
    let td_amount = document.createElement("td");
    td_amount.setAttribute("contenteditable", true);
    td_amount.addEventListener('input', () => {
        overview_update_total();
    });
    tr.appendChild(td_amount);
    let td_delete = document.createElement("td");
    let btn_del = document.createElement("button");
    btn_del.setAttribute("type", "button");
    btn_del.className = "btn btn-danger";
    btn_del.innerHTML = "<i class='bi bi-x-square'></i>";
    btn_del.addEventListener('click', (e) => {
        let t = e.target;
        while(t.localName != "tr"){
            t = t.parentNode;
        }
        t.remove();
        overview_update_total();
    });
    td_delete.appendChild(btn_del);
    tr.appendChild(td_delete);
    document.getElementById("overview_add_modal_tbody").appendChild(tr);
})

document.getElementById("overview_modal_add_save").addEventListener('click', () => {
    ov.addLog(document.getElementById("overview_modal_add_date").value, document.getElementById("overview_modal_add_source").value, document.getElementById("overview_modal_add_amount").value, document.getElementById("overview_modal_add_commit").value);
    modal.hide();
});

document.getElementById("overview_btn_update").addEventListener('click', () => {
    let data = ov.update();
    if (data['status'] != 'OK') {
        window.alert("取得資料發生錯誤");
        return;
    }
    document.getElementById('overview_tbody').innerHTML = "";
    let result = data['result'][0]['values'];
    for (let row of result) {
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
    };
});
function overview_update_total() {
    console.log("overview_update_total()");
    let nodes = document.getElementsByClassName("overview_modal_add_tr");
    let total = 0;
    for (let node of nodes) {
        console.log("Get ", node.childNodes[1].innerText);
        if (node.childNodes[1].innerText != "") {
            try {
                total += parseInt(node.childNodes[1].innerText);
            } catch (e) {
                window.alert("輸入資料 '", node.childNodes[1].innerText , "' 非有效數字!");
            }
        }
    };
    document.getElementById("overview_add_modal_total").innerText = total;
}
console.log("overview OK");

let pla = new plan(db);
console.log("plan OK");

let manag = new manage(db);
console.log("manage OK");