---
layout: base
---

<p class="fs-2 text-center">倉儲系統</p>
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
                <th scope="col">名稱</th>
                <th scope="col">存放位置</th>
                <th scope="col">數量</th>
                <th scope="col">動作</th>
            </tr>
        </thead>
        <tbody id="overview_tbody">
        </tbody>
    </table>
</div>
<script type="module" src="assets/js/warehouse_system.mjs"></script>