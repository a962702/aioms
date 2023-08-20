---
layout: base
---

<p class="fs-2 text-center">發票系統</p>
<hr />
<div class="pages">
    <div class="text-center">
        <div class="spinner-animation" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p class="fs-2">準備中...</p>
    </div>
</div>
<div id="overview" class="pages container" style="display: none">
    <p class="fs-3 text-center">總覽</p>
    <div class="mb-3">
        <button class="btn btn-primary m-1" id="overview_btn_add" data-bs-toggle="modal"
            data-bs-target="#overview_modal_add">新增發票</button>
        <button class="btn btn-success m-1" id="overview_btn_update">重新整理</button>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th scope="col">載具名稱</th>
                <th scope="col">發票日期</th>
                <th scope="col">商店店名</th>
                <th scope="col">發票號碼</th>
                <th scope="col">總金額</th>
                <th scope="col">動作</th>
            </tr>
        </thead>
        <tbody id="overview_tbody">
        </tbody>
    </table>
</div>
<script type="module" src="assets/js/invoice_system.mjs"></script>