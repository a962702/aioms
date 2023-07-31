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
    let acc_lists = acc.getLists();
    if (!acc_lists['result'][0]) {
        window.alert("尚未建立帳戶\n請先至 帳務系統 - 帳戶管理 進行設定");
        return;
    }
    $("#overview_add_modal_tbody").append(
        $("<tr>" ).addClass("overview_modal_add_tr").append(
            $("<td>").append(
                $("<select>").addClass("form-select")
            ),
            $("<td>").append(
                $("<input>").addClass("form-control").attr("type", "number").on("input", () => {
                    overview_add_modal_update_total();
                })
            ),
            $("<td>").append(
                $("<button>").addClass("btn btn-danger").attr("type", "button").html("<i class='bi bi-trash'></i>").on("click", (e) => {
                    let t = e.target;
                    while (t.localName != "tr") {
                        t = t.parentNode;
                    }
                    t.remove();
                    overview_add_modal_update_total();
                })
            )
        )
    );
    jQuery.each(acc_lists['result'][0]['values'], (index, value) => {
        $("#overview_add_modal_tbody tr:last td:first select").append($("<option>").text(value[1]));
    })
})

$("#overview_modal_add_save").on('click', () => {
    ov.add($("#overview_modal_add_date").val(), $("#overview_modal_add_type").val(), $("#overview_modal_add_description").val(), $("#overview_modal_add_invoice").val(), $("#overview_add_modal_total").text(), $("#overview_modal_add_commit").val());
    $(".overview_modal_add_tr").each((index, element) => {
        //acc.add_transaction(element.children().eq(0).children().val(), element.children().eq(1).children().val());
    });
    overview_modal_add.hide();
    overview_update();
});

function overview_update(){
    let data = ov.getLists();
    if (data['status'] != 'OK') {
        window.alert("取得資料發生錯誤");
        return;
    }
    $('#overview_tbody').html("");
    if (!data['result'][0])
        return;
    jQuery.each(data['result'][0]['values'], (index, value) => {
        $("#overview_tbody").append(
            $("<tr>").append(
                $("<td>").text(value[1]), // date
                $("<td>").text(value[2]), // type
                $("<td>").text(value[3]), // description
                $("<td>").text(value[5]), // amount
                $("<td>") // action
            )
        );
    });
}
overview_update();

$("#overview_btn_update").on('click', () => {
    overview_update();
});

function overview_add_modal_update_total() {
    let total = 0;
    $(".overview_modal_add_tr").each((index, element) => {
        if (element.children().eq(1).children().val() != ""){
            total += parseInt(element.childNodes[1].childNodes[0].value);
        }
    });
    $("#overview_add_modal_total").text(total);
}

$("#account_modal_add_save").on('click', () => {
    acc.add($("#account_modal_add_name").val(), $("#account_modal_add_description").val(),  $("#account_modal_add_amount").val());
    account_modal_add.hide();
});

function account_update(){
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
};
account_update();

$("#account_btn_update").on('click', () => {
    account_update();
});

function chg_page() {
    if (location.hash === "#" || location.hash === "")
        location.hash = "#overview";
    $(".pages").css("display", "none");
    if (location.hash === "#overview") {
        $("#overview").css("display", "block");
    }
    else if (location.hash === "#account") {
        $("#account").css("display", "block");
    }
}
chg_page();

$(window).on('hashchange', () => {
    chg_page();
});
