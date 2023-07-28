---
layout: base
---

<p class="fs-2 text-center">帳務系統</p>
<button class="btn btn-primary" id="overview_btn_add">新增紀錄</button>
<div id="overview_modal_add" title="新增紀錄">
    <fieldset>
        <label for="overview_modal_add_date" class="form-label">日期</label>
        <input type="date" class="text ui-widget-content ui-corner-all" id="overview_modal_add_date">
        <label for="overview_modal_add_source" class="form-label">來源</label>
        <input type="text" class="text ui-widget-content ui-corner-all" id="overview_modal_add_source">
        <label for="overview_modal_add_amount" class="form-label">金額</label>
        <input type="number" class="text ui-widget-content ui-corner-all" id="overview_modal_add_amount">
        <label for="overview_modal_add_commit" class="form-label">備註</label>
        <input type="text" class="text ui-widget-content ui-corner-all" id="overview_modal_add_commit">
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