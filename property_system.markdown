---
layout: base
---

<p class="fs-2 text-center">財產系統</p>
<hr />
<div class="pages">
    <div class="text-center">
        <div class="spinner-grow" style="width: 5rem; height: 5rem;" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p class="fs-2">準備中...</p>
    </div>
</div>
<div id="overview" class="pages container" style="display: none">
    <p class="fs-3 text-center">總覽</p>
    <div class="mb-3">
        <button class="btn btn-primary m-1" id="overview_btn_add" data-bs-toggle="modal"
            data-bs-target="#overview_modal_add">新增</button>
        <button class="btn btn-success m-1" id="overview_btn_update">重新整理</button>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th scope="col">編號</th>
                <th scope="col">類別</th>
                <th scope="col">名稱</th>
                <th scope="col">單價</th>
                <th scope="col">使用年限</th>
                <th scope="col">建檔日期</th>
                <th scope="col">動作</th>
            </tr>
        </thead>
        <tbody id="overview_tbody">
        </tbody>
    </table>
</div>
<script type="module" src="assets/js/property_system.mjs"></script>