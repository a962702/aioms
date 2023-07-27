import { overview } from './module/account_system/overview.mjs'
import { plan } from './module/account_system/plan.mjs'
import { manage } from './module/account_system/manage.mjs'

let ov = new overview();
ov.init();
document.getElementById("overview_modal_add_save").addEventListener('click', ()=>{
    ov.addLog(document.getElementById("overview_modal_add_date").value, document.getElementById("overview_modal_add_source").value, document.getElementById("overview_modal_add_amount").value, document.getElementById("overview_modal_add_commit").value);
    const modal = new bootstrap.Modal('#overview_modal_add');
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
    console.log(result);
    for (let row of result){
        console.log("Adding row: ", row);
        let tr = document.createElement("tr");
        let td_id = document.createElement("td");
        td_id.innerText = row['id'];
        tr.appendChild(td_id);
        let td_date = document.createElement("td");
        td_date.innerText = row['date'];
        tr.appendChild(td_date);
        let td_source = document.createElement("td");
        td_source.innerText = row['source'];
        tr.appendChild(td_source);
        let td_amount = document.createElement("td");
        td_amount.innerText = row['amount'];
        tr.appendChild(td_amount);
        let td_commit = document.createElement("td");
        td_commit.innerText = row['commit'];
        tr.appendChild(td_commit);
        document.getElementById('overview_tbody').appendChild(tr);
    }
});
document.getElementById("overview_btn3").addEventListener('click', ()=>{
    ov.exec(document.getElementById('sql_statement').value);
});
console.log("overview OK");

let pla = new plan();
pla.init();
console.log("plan OK");

let manag = new manage();
manag.init();
console.log("manage OK");