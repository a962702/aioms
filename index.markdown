---
layout: base
---

<p class="text-center fs-2">歡迎使用<br />AIOMS - 整合式管理平台</p>
<hr />
<div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
    <div class="col">
        <div class="card h-100 text-center m-2">
            <div class="card-body">
                <h2 class="card-title">帳務系統</h2>
                <p class="card-text">追蹤與管理財務交易和記錄，協助您紀錄準確的財務報告。</p>
            </div>
            <div class="card-footer">
                <a type="button" class="btn btn-primary" href="account_system.html">進入系統</a>
            </div>
        </div>
    </div>
    <div class="col">
        <div class="card h-100 text-center m-2">
            <div class="card-body">
                <h2 class="card-title">倉儲系統</h2>
                <p class="card-text">儲存、追蹤和管理庫存物品，降低不必要的購買。</p>
            </div>
            <div class="card-footer">
                <a type="button" class="btn btn-primary" href="warehouse_system.html">進入系統</a>
            </div>
        </div>
    </div>
    <div class="col">
        <div class="card h-100 text-center m-2">
            <div class="card-body">
                <h2 class="card-title">發票系統</h2>
                <p class="card-text">追蹤、紀錄各期發票，並提供查詢商品歷史售價紀錄。</p>
            </div>
            <div class="card-footer">
                <a type="button" class="btn btn-primary" href="invoice_system.html">進入系統</a>
            </div>
        </div>
    </div>
    <div class="col">
        <div class="card h-100 text-center m-2">
            <div class="card-body">
                <h2 class="card-title">財產系統</h2>
                <p class="card-text">追蹤和管理的固定資產、非消耗品等財產，有助於最大程度地優化財產運用和管理。</p>
            </div>
            <div class="card-footer">
                <a type="button" class="btn btn-primary" href="property_system.html">進入系統</a>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="loading_modal" data-bs-backdrop="static" tabindex="-1"
    aria-labelledby="loading_modal_label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body">
                <div class="text-center">
                    <div class="spinner-animation" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="fs-2">正在準備資料庫連線...</p>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="module" src="assets/js/index.mjs"></script>