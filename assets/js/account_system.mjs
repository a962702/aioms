import { database } from './module/database/main.mjs'
import { overview } from './module/account_system/overview.mjs'
import { plan } from './module/account_system/plan.mjs'
import { account } from './module/account_system/account.mjs'
import { setting } from './module/setting/main.mjs'

let db = new database();
await db.init();

let ov = new overview(db);
let acc = new account(db);
let s = new setting(db);
const overview_modal_add = new bootstrap.Modal('#overview_modal_add');
const overview_modal_getDetail = new bootstrap.Modal('#overview_modal_getDetail');
const account_modal_add = new bootstrap.Modal('#account_modal_add');
const account_modal_edit = new bootstrap.Modal('#account_modal_edit');
const uploading_modal = new bootstrap.Modal('#uploading_modal');

$("#setting_btn_runcommand").on('click', () => {
    s.exec($('#sql_statement').val());
});

$("#btn_GDDB_connect").on("click", () => {
    db.GD_connect();
})

$("#btn_GDDB_signout").on("click", () => {
    db.GD_signout();
})

/***** Account System - overview *****/

let today = new Date(Date.now());
document.getElementById("overview_start_date").valueAsDate = new Date(today.getFullYear(), today.getMonth(), 1);
$("#overview_start_date").on('change', () => {
    overview_update();
})

document.getElementById("overview_end_date").valueAsDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
$("#overview_end_date").on('change', () => {
    overview_update();
})

$("#overview_add_modal_add_btn").on('click', () => {
    let acc_lists = acc.getLists();
    if (!acc_lists['result'][0]) {
        window.alert("尚未建立帳戶\n請先至 帳務系統 - 帳戶管理 進行設定");
        return;
    }
    $("#overview_add_modal_tbody").append(
        $("<tr>").addClass("overview_modal_add_tr").append(
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
        $("#overview_add_modal_tbody tr:last td:first select").append($("<option>").text(value[1]).attr("id", value[0]));
    })
})

$("#overview_modal_add_save").on('click', () => {
    if ($("#overview_modal_add_date").val() == "") {
        window.alert("請輸入日期");
        return;
    }
    if ($("#overview_modal_add_description").val() == "") {
        window.alert("請輸入說明");
        return;
    }
    if ($("#overview_add_modal_total").text() == "0") {
        window.alert("金額為0");
        return;
    }
    overview_modal_add.hide();
    $("#overview_modal_add").one('hidden.bs.modal', () => {
        uploading_modal.show();
        $("#uploading_modal").one('shown.bs.modal', () => {
            $(document).one('DB-save', () => {
                uploading_modal.hide();
            })
            let id = ov.add(new Date($("#overview_modal_add_date").val()).getTime(), $("#overview_modal_add_type").val(), $("#overview_modal_add_description").val(), $("#overview_modal_add_invoice").val(), $("#overview_add_modal_total").text(), $("#overview_modal_add_commit").val());
            $(".overview_modal_add_tr").each((index, element) => {
                acc.add_transaction($(element).children().eq(0).children().children(":selected").attr("id"), id, $("#overview_modal_add_type").val(), $(element).children().eq(1).children().val());
            });
        })

    })
});

$("#overview_modal_getDetail").on('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const id = button.getAttribute('data-bs-id');
    let arr = ov.getDetail(id);
    const date = arr['result'][0]['values'][0][0];
    const type = arr['result'][0]['values'][0][1];
    const description = arr['result'][0]['values'][0][2];
    const invoice = arr['result'][0]['values'][0][3];
    const amount = arr['result'][0]['values'][0][4];
    const commit = arr['result'][0]['values'][0][5];
    document.getElementById("overview_modal_getDetail_date").valueAsDate = new Date(parseInt(date));
    $('#overview_modal_getDetail_type').val(type);
    $('#overview_modal_getDetail_description').val(description);
    $('#overview_modal_getDetail_invoice').val(invoice);
    $('#overview_modal_getDetail_total').text(amount);
    $('#overview_modal_getDetail_commit').val(commit);
    $('#overview_modal_getDetail_save').attr("dataid", id);
    let arr2 = acc.getRecordTransaction(id);
    $('#overview_modal_getDetail_tbody').html("");
    jQuery.each(arr2['result'][0]['values'], (index, value) => {
        $("#overview_modal_getDetail_tbody").append(
            $("<tr>").append(
                $("<td>").text(value[0]), // name
                $("<td>").text(value[1]) // amount
            )
        );
    });
})

$("#overview_modal_getDetail_save").on('click', () => {
    if ($("#overview_modal_getDetail_date").val() == "") {
        window.alert("請輸入日期");
        return;
    }
    if ($("#overview_modal_getDetail_description").val() == "") {
        window.alert("請輸入說明");
        return;
    }
    overview_modal_getDetail.hide();
    $("#overview_modal_getDetail").one('hidden.bs.modal', () => {
        uploading_modal.show();
        $("#uploading_modal").one('shown.bs.modal', () => {
            $(document).one('DB-save', () => {
                uploading_modal.hide();
            })
            ov.update($('#overview_modal_getDetail_save').attr("dataid"), new Date($("#overview_modal_getDetail_date").val()).getTime(), $("#overview_modal_getDetail_type").val(), $("#overview_modal_getDetail_description").val(), $("#overview_modal_getDetail_invoice").val(), $("#overview_modal_getDetail_total").text(), $("#overview_modal_getDetail_commit").val());
        })

    })
})

function overview_update() {
    let start_date = new Date($("#overview_start_date").val()).getTime();
    let end_date = new Date($("#overview_end_date").val()).getTime();
    let data = ov.getLists(start_date, end_date);
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
                $("<td>").text(new Date(parseInt(value[1])).getFullYear() + "年" + (new Date(parseInt(value[1])).getMonth() + 1) + "月" + new Date(parseInt(value[1])).getDate() + "日"), // date
                $("<td>").text(value[2] == "1" ? "支出" : "收入"), // type
                $("<td>").text(value[3]), // description
                $("<td>").text(value[4]), // amount
                $("<td>").append(// action
                    $("<button>").attr('type', 'button').addClass('btn btn-secondary m-1').text("檢視/修改").attr("data-bs-toggle", "modal").attr("data-bs-target", "#overview_modal_getDetail").attr("data-bs-id", value[0])/*,
                    $("<button>").attr('type', 'button').addClass('btn btn-info m-1').text("修改"),
                    $("<button>").attr('type', 'button').addClass('btn btn-danger m-1').text("刪除")*/
                )
            )
        );
    });
}
overview_update();

$("#overview_btn_update").on('click', () => {
    overview_update();
});

$(document).on('DB-changed', () => {
    overview_update();
})

function overview_add_modal_update_total() {
    let total = 0;
    $(".overview_modal_add_tr").each((index, element) => {
        if (element.childNodes[1].childNodes[0].value != "") {
            total += parseInt(element.childNodes[1].childNodes[0].value);
        }
    });
    $("#overview_add_modal_total").text(total);
}

/***** Account System - account *****/

$("#account_modal_add_save").on('click', () => {
    account_modal_add.hide();
    $("#account_modal_add").one('hidden.bs.modal', () => {
        uploading_modal.show();
        $("#uploading_modal").one('shown.bs.modal', () => {
            acc.add($("#account_modal_add_name").val(), $("#account_modal_add_description").val(), $("#account_modal_add_amount").val());
            uploading_modal.hide();
        })
    })
});

$("#account_modal_getTransaction").on('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const account_id = button.getAttribute('data-bs-account_id');
    const name = button.getAttribute('data-bs-name');
    let arr = acc.getTransaction(account_id);
    $('#account_modal_getTransaction_tbody').html("");
    $('#account_modal_getTransaction_label_name').text(name);
    if (!arr['result'][0])
        return;
    jQuery.each(arr['result'][0]['values'], (index, value) => {
        $("#account_modal_getTransaction_tbody").append(
            $("<tr>").append(
                $("<td>").text(new Date(parseInt(value[0])).getFullYear() + "年" + (new Date(parseInt(value[0])).getMonth() + 1) + "月" + new Date(parseInt(value[0])).getDate() + "日"), // date
                $("<td>").text(value[1]), // description
                $("<td>").text(value[2] == "1" ? "支出" : "收入"), // type
                $("<td>").text(value[3]) // amount
            )
        );
    });
})

$("#account_modal_edit").on('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const dataid = button.getAttribute('data-bs-id');
    const name = button.getAttribute('data-bs-name');
    const description = button.getAttribute('data-bs-description');
    const amount = button.getAttribute('data-bs-amount');
    $('#account_modal_edit_label_name').text(name);
    $('#account_modal_edit_name').val(name);
    $('#account_modal_edit_description').val(description);
    $('#account_modal_edit_amount').val(amount);
    $("#account_modal_edit_save").attr('dataid', dataid);
})

$("#account_modal_edit_save").on('click', () => {
    account_modal_edit.hide();
    $("#account_modal_edit").on('hidden.bs.modal', () => {
        $("#account_modal_edit").off('hidden.bs.modal');
        uploading_modal.show();
        $("#uploading_modal").on('shown.bs.modal', () => {
            $("#uploading_modal").off('shown.bs.modal');
            acc.update($("#account_modal_edit_save").attr('dataid'), $("#account_modal_edit_name").val(), $("#account_modal_edit_description").val(), $("#account_modal_edit_amount").val());
            uploading_modal.hide();
        })
    })
});

function account_update() {
    let data = acc.getLists();
    if (data['status'] != 'OK') {
        window.alert("取得資料發生錯誤");
        return;
    }
    $('#account_tbody').html("");
    if (!data['result'][0])
        return;
    jQuery.each(data['result'][0]['values'], (index, value) => {
        $("#account_tbody").append(
            $("<tr>").append(
                $("<td>").text(value[1]), // name
                $("<td>").text(value[2]), // description
                $("<td>").text(value[3]), // amount
                $("<td>").append(// action
                    $("<button>").attr('type', 'button').addClass('btn btn-secondary m-1').text("檢視紀錄").attr("data-bs-toggle", "modal").attr("data-bs-target", "#account_modal_getTransaction").attr("data-bs-account_id", value[0]).attr("data-bs-name", value[1]),
                    $("<button>").attr('type', 'button').addClass('btn btn-info m-1').text("修改").attr("data-bs-toggle", "modal").attr("data-bs-target", "#account_modal_edit").attr("data-bs-id", value[0]).attr("data-bs-name", value[1]).attr("data-bs-description", value[2]).attr("data-bs-amount", value[3])
                )
            )
        );
    });
};
account_update();

$("#account_btn_update").on('click', () => {
    account_update();
});

$(document).on('DB-changed', () => {
    account_update();
})

/***** General *****/

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
