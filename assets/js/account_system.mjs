import { database } from './module/database/main.mjs'
import { overview } from './module/account_system/overview.mjs'
import { plan } from './module/account_system/plan.mjs'
import { account } from './module/account_system/account.mjs'

let db = new database();
await db.init();

let ov = new overview(db);
let acc = new account(db);
const overview_modal_add = new bootstrap.Modal('#overview_modal_add');
const account_modal_add = new bootstrap.Modal('#account_modal_add');

$("#overview_add_modal_add_btn").on('click', () => {
    let tr = document.createElement("tr");
    tr.className = "overview_modal_add_tr";
    let td_source = document.createElement("td");
    let sel = document.createElement("select");
    sel.className = "form-select";
    let result = acc.getLists();
    if (!result['result'][0]) {
        window.alert("尚未建立帳戶\n請先至 帳務系統 - 帳戶管理 進行設定");
    }
    else {
        for (let acc of result['result'][0]['values']) {
            let opt = document.createElement("option");
            opt.innerText = acc[1];
            sel.appendChild(opt);
        }
    }
    td_source.appendChild(sel);
    tr.appendChild(td_source);
    let td_amount = document.createElement("td");
    let input_amount = document.createElement("input");
    input_amount.className = "form-control";
    input_amount.setAttribute("type", "number");
    input_amount.addEventListener('input', () => {
        overview_update_total();
    });
    td_amount.appendChild(input_amount);
    tr.appendChild(td_amount);
    let td_delete = document.createElement("td");
    let btn_del = document.createElement("button");
    btn_del.setAttribute("type", "button");
    btn_del.className = "btn btn-danger";
    btn_del.innerHTML = "<i class='bi bi-trash'></i>";
    btn_del.addEventListener('click', (e) => {
        let t = e.target;
        while (t.localName != "tr") {
            t = t.parentNode;
        }
        t.remove();
        overview_update_total();
    });
    td_delete.appendChild(btn_del);
    tr.appendChild(td_delete);
    document.getElementById("overview_add_modal_tbody").appendChild(tr);
})

$("#overview_modal_add_save").on('click', () => {
    ov.add($("#overview_modal_add_date").val(), $("#overview_modal_add_type").val(), $("#overview_modal_add_description").val(), $("#overview_modal_add_invoice").val(), $("#overview_add_modal_total").text(), $("#overview_modal_add_commit").val());
    overview_modal_add.hide();
});

$("#overview_btn_update").on('click', () => {
    let data = ov.getLists();
    if (data['status'] != 'OK') {
        window.alert("取得資料發生錯誤");
        return;
    }
    $('#overview_tbody').html("");
    if (!data['result'][0])
        return;
    let result = data['result'][0]['values'];
    for (let row of result) {
        let tr = document.createElement("tr");
        let td_date = document.createElement("td");
        td_date.innerText = row[1];
        tr.appendChild(td_date);
        let td_type = document.createElement("td");
        td_type.innerText = row[2];
        tr.appendChild(td_type);
        let td_description = document.createElement("td");
        td_description.innerText = row[3];
        tr.appendChild(td_description);
        let td_amount = document.createElement("td");
        td_amount.innerText = row[5];
        tr.appendChild(td_amount);
        let td_action = document.createElement("td");
        tr.appendChild(td_action);
        document.getElementById('overview_tbody').appendChild(tr);
    };
});
function overview_update_total() {
    let nodes = document.getElementsByClassName("overview_modal_add_tr");
    let total = 0;
    for (let node of nodes) {
        if (node.childNodes[1].childNodes[0].value != "") {
            total += parseInt(node.childNodes[1].childNodes[0].value);
        }
    };
    document.getElementById("overview_add_modal_total").innerText = total;
}

$("#account_modal_add_save").on('click', () => {
    acc.add($("#account_modal_add_name").val(), $("#account_modal_add_description").val(),  $("#account_modal_add_amount").val());
    account_modal_add.hide();
});

$("#account_btn_update").on('click', () => {
    let data = acc.getLists();
    if (data['status'] != 'OK') {
        window.alert("取得資料發生錯誤");
        return;
    }
    $('#account_tbody').html("");
    if (!data['result'][0])
        return;
    let result = data['result'][0]['values'];
    for (let row of result) {
        let tr = document.createElement("tr");
        let td_name = document.createElement("td");
        td_name.innerText = row[1];
        tr.appendChild(td_name);
        let td_description = document.createElement("td");
        td_description.innerText = row[2];
        tr.appendChild(td_description);
        let td_amount = document.createElement("td");
        td_amount.innerText = row[3];
        tr.appendChild(td_amount);
        let td_action = document.createElement("td");
        tr.appendChild(td_action);
        document.getElementById('account_tbody').appendChild(tr);
    };
});

function chg_page() {
    if (location.hash === "#" || location.hash === "")
        return;
    $(".pages").css("display", "none");
    if (location.hash === "#overview") {
        $("#overview").css("display", "block");
    }
    else if (location.hash === "#account") {
        $("#account").css("display", "block");
    }
}
chg_page();

window.addEventListener('hashchange', () => {
    chg_page();
});
