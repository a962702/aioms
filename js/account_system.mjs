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
document.getElementById("overview_btn2").addEventListener('click', ()=>{
    ov.getDetails();
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