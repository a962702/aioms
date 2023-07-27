import { overview } from './module/account_system/overview.mjs'
import { plan } from './module/account_system/plan.mjs'
import { manage } from './module/account_system/manage.mjs'

let ov = new overview();
ov.init();
document.getElementById("overview_btn1").addEventListener('click', ()=>{
    ov.addLog();
});
document.getElementById("overview_btn2").addEventListener('click', ()=>{
    ov.getDetails();
});
document.getElementById("overview_btn3").addEventListener('click', ()=>{
    ov.showTables();
});
console.log("overview OK");

let pla = new plan();
pla.init();
console.log("plan OK");

let manag = new manage();
manag.init();
console.log("manage OK");