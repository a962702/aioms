---
layout: base
---

<p class="fs-2 text-center">帳務系統</p>
<button class="btn btn-primary" id="overview_btn_add">新增紀錄</button>
<div id="overview_modal_add" title="新增紀錄">
    <fieldset>
        <div class="container">
            <div class="row">
                <div class="col-3">
                    <label for="overview_modal_add_date">日期</label>
                    <input type="date" class="text ui-widget-content ui-corner-all" id="overview_modal_add_date">
                    <label for="overview_modal_add_type">類型</label>
                    <select id="overview_modal_add_type">
                        <option value="in">收入</option>
                        <option value="out">支出</option>
                        <option value="change">調動</option>
                    </select>
                </div>
                <div class="col-9">
                    <label for="overview_modal_add_description">說明</label>
                    <input type="text" class="text ui-widget-content ui-corner-all" id="overview_modal_add_description" style="width: 100%; height: 100%;">
                </div>
            </div>
            <div class="row">
                <div class="col" style="background: green;">
                    <label for="overview_modal_add_source">來源</label>
                    <input type="text" class="text ui-widget-content ui-corner-all" id="overview_modal_add_source">
                </div>
                <div class="col" style="background: orange;">
                    <label for="overview_modal_add_amount">金額</label>
                    <input type="number" class="text ui-widget-content ui-corner-all" id="overview_modal_add_amount">
                </div>
            </div>
            <div class="row">
                <label for="overview_modal_add_commit">備註</label>
                <input type="text" class="text ui-widget-content ui-corner-all" id="overview_modal_add_commit" style="width: 100%; height: 100%;">
            </div>
        </div>
    </fieldset>
</div>
<button class="btn" id="overview_btn_update">更新</button>
<table class="table">
    <thead>
        <tr>
            <th scope="col">ID</th>
            <th scope="col">日期</th>
            <th scope="col">來源</th>
            <th scope="col">金額</th>
            <th scope="col">備註</th>
        </tr>
    </thead>
    <tbody id="overview_tbody">
    </tbody>
</table>
<script type="module" src="assets/js/account_system.mjs"></script>