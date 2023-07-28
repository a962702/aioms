---
layout: base
---

<p class="fs-2 text-center">帳務系統</p>
<button class="btn btn-primary" id="overview_btn_add" data-bs-toggle="modal"
    data-bs-target="#overview_modal_add">新增紀錄</button>
<div class="modal fade" id="overview_modal_add" tabindex="-1" aria-labelledby="overview_modal_add_label" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="overview_modal_add_label">新增紀錄</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="overview_modal_add_date" class="form-label">日期</label>
                    <input type="date" class="form-control" id="overview_modal_add_date">
                </div>
                <div class="mb-3">
                    <label for="overview_modal_add_source" class="form-label">來源</label>
                    <input type="text" class="form-control" id="overview_modal_add_source">
                </div>
                <div class="mb-3">
                    <label for="overview_modal_add_amount" class="form-label">金額</label>
                    <input type="number" class="form-control" id="overview_modal_add_amount">
                </div>
                <div class="mb-3">
                    <label for="overview_modal_add_commit" class="form-label">備註</label>
                    <input type="text" class="form-control" id="overview_modal_add_commit">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" id="overview_modal_add_save">儲存</button>
            </div>
        </div>
    </div>
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