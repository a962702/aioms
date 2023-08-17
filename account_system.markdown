---
layout: base
---

<p class="fs-2 text-center">帳務系統</p>
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
    <button class="btn btn-primary m-1" id="overview_btn_add" data-bs-toggle="modal"
        data-bs-target="#overview_modal_add">新增紀錄</button>
    <button class="btn btn-success m-1" id="overview_btn_update">重新整理</button>
    <table class="table">
        <thead>
            <tr>
                <th scope="col">日期</th>
                <th scope="col">類型</th>
                <th scope="col">說明</th>
                <th scope="col">金額</th>
                <th scope="col">動作</th>
            </tr>
        </thead>
        <tbody id="overview_tbody">
        </tbody>
    </table>
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
                        <label for="overview_modal_add_type" class="form-label">類型</label>
                        <select class="form-select" id="overview_modal_add_type">
                            <option value="1" selected>支出</option>
                            <option value="2">收入</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="overview_modal_add_description" class="form-label">說明</label>
                        <input type="text" class="form-control" id="overview_modal_add_description">
                    </div>
                    <div class="mb-3">
                        <label for="overview_modal_add_invoice" class="form-label">發票號碼</label>
                        <input type="text" class="form-control" id="overview_modal_add_invoice">
                    </div>
                    <div class="mb-3">
                        <table class="table">
                            <thead>
                                <tr>
                                <th scope="col">帳戶</th>
                                <th scope="col">金額</th>
                                <th scope="col">刪除</th>
                                </tr>
                            </thead>
                            <tbody id="overview_add_modal_tbody">
                            </tbody>
                        </table>
                        <button type="button" class="btn btn-info" id="overview_add_modal_add_btn"><i class="bi bi-plus-circle"></i>新增</button>
                        <p>總金額：<span id="overview_add_modal_total">0</span></p>
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
</div>
<div id="account" class="pages container" style="display: none">
    <p class="fs-3 text-center">帳戶管理</p>
    <button class="btn btn-primary m-1" id="account_btn_add" data-bs-toggle="modal"
        data-bs-target="#account_modal_add">新增帳戶</button>
    <button class="btn btn-success m-1" id="account_btn_update">重新整理</button>
    <table class="table">
        <thead>
            <tr>
                <th scope="col">名稱</th>
                <th scope="col">備註</th>
                <th scope="col">可用金額</th>
                <th scope="col">動作</th>
            </tr>
        </thead>
        <tbody id="account_tbody">
        </tbody>
    </table>
    <div class="modal fade" id="account_modal_add" tabindex="-1" aria-labelledby="account_modal_add_label" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="account_modal_add_label">新增帳戶</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="account_modal_add_name" class="form-label">名稱</label>
                        <input type="text" class="form-control" id="account_modal_add_name">
                    </div>
                    <div class="mb-3">
                        <label for="account_modal_add_description" class="form-label">說明</label>
                        <input type="text" class="form-control" id="account_modal_add_description">
                    </div>
                    <div class="mb-3">
                        <label for="account_modal_add_amount" class="form-label">起始金額</label>
                        <input type="number" class="form-control" id="account_modal_add_amount">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" id="account_modal_add_save">儲存</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="account_modal_getTransaction" tabindex="-1" aria-labelledby="account_modal_getTransaction_label" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="account_modal_getTransaction_label">檢視紀錄 - <span id="account_modal_getTransaction_label_name"></span></h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">日期</th>
                                <th scope="col">說明</th>
                                <th scope="col">類型</th>
                                <th scope="col">金額</th>
                            </tr>
                        </thead>
                        <tbody id="account_modal_getTransaction_tbody">
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="account_modal_edit" tabindex="-1" aria-labelledby="account_modal_edit_label" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="account_modal_edit_label">編輯 - <span id="account_modal_edit_label_name"></span></h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="account_modal_add_name" class="form-label">名稱</label>
                        <input type="text" class="form-control" id="account_modal_edit_name">
                    </div>
                    <div class="mb-3">
                        <label for="account_modal_add_description" class="form-label">說明</label>
                        <input type="text" class="form-control" id="account_modal_edit_description">
                    </div>
                    <div class="mb-3">
                        <label for="account_modal_add_amount" class="form-label">起始金額</label>
                        <input type="number" class="form-control" id="account_modal_edit_amount">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" id="account_modal_edit_save">儲存</button>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="module" src="assets/js/account_system.mjs"></script>