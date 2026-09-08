<?php

use App\Modules\Foundation\Http\Controllers\AuthController;
use App\Modules\Foundation\Http\Controllers\ContextController;
use App\Modules\Sales\Http\Controllers\UnsoldSalesReturnApprovalController;
use App\Modules\Sales\Http\Controllers\UnsoldSalesReturnController;
use App\Modules\Sales\Http\Controllers\UnsoldSalesReturnEvidenceController;
use App\Modules\Sales\Http\Controllers\UnsoldSalesReturnFinanceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => [
    'status' => 'ok',
    'service' => 'qt-foods-erp-crm',
    'architecture' => 'modular-monolith',
]);

Route::middleware('web')->prefix('v1')->group(function () {
    Route::get('/auth/csrf', [AuthController::class, 'csrf']);
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    Route::middleware('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/contexts', [ContextController::class, 'index']);
        Route::post('/contexts/select', [ContextController::class, 'select']);

        Route::middleware('erp.context')->group(function () {
            Route::get('/work/tasks', fn (Request $request) => ['data' => [
                [
                    'id' => 'TASK-001',
                    'title' => 'Review today\'s operational exceptions',
                    'priority' => 'HIGH',
                    'owner' => $request->user()->name,
                ],
                [
                    'id' => 'TASK-002',
                    'title' => 'Complete pending approvals in your role',
                    'priority' => 'NORMAL',
                    'owner' => $request->user()->name,
                ],
            ]])->middleware('erp.screen:WRK-HOME');

            Route::get('/admin/organisation', fn () => ['data' => []])->middleware('erp.screen:ADM-ORG');
            Route::get('/admin/users', fn () => ['data' => []])->middleware('erp.screen:ADM-USER');
            Route::get('/admin/roles', fn () => ['data' => []])->middleware('erp.screen:ADM-ROLE');
            Route::get('/admin/approvals', fn () => ['data' => []])->middleware('erp.screen:ADM-RULE');
            Route::get('/admin/audit', fn () => ['data' => []])->middleware('erp.screen:ADM-AUD');
            Route::get('/admin/integrations', fn () => ['data' => []])->middleware('erp.screen:ADM-INT');

            Route::get('/master/items', fn () => ['data' => []])->middleware('erp.screen:MD-ITEM');
            Route::get('/master/parties', fn () => ['data' => []])->middleware('erp.screen:MD-PARTY');
            Route::get('/master/brands', fn () => ['data' => []])->middleware('erp.screen:MD-BRAND');
            Route::get('/manufacturing/recipes', fn () => ['data' => []])->middleware('erp.screen:MD-REC');

            Route::get('/procurement/requisitions', fn () => ['data' => []])->middleware('erp.screen:PUR-REQ');
            Route::get('/procurement/purchase-orders', fn () => ['data' => []])->middleware('erp.screen:PUR-PO');
            Route::get('/procurement/receipts', fn () => ['data' => []])->middleware('erp.screen:INB-GRN');
            Route::get('/quality/incoming', fn () => ['data' => []])->middleware('erp.screen:QC-IN');

            Route::get('/inventory/stock', fn () => ['data' => []])->middleware('erp.screen:INV-STK');
            Route::get('/inventory/transfers', fn () => ['data' => []])->middleware('erp.screen:INV-TRF');
            Route::get('/inventory/counts', fn () => ['data' => []])->middleware('erp.screen:INV-COUNT');

            Route::get('/planning/mrp', fn () => ['data' => []])->middleware('erp.screen:PLAN-MRP');
            Route::get('/manufacturing/orders', fn () => ['data' => []])->middleware('erp.screen:PRO-ORDER');
            Route::get('/manufacturing/stages', fn () => ['data' => []])->middleware('erp.screen:PRO-STAGE');
            Route::get('/manufacturing/finished-goods', fn () => ['data' => []])->middleware('erp.screen:FG-LOT');
            Route::get('/trace/cases', fn () => ['data' => []])->middleware('erp.screen:TRACE-CASE');

            Route::get('/sales/leads', fn () => ['data' => []])->middleware('erp.screen:CRM-LEAD');
            Route::get('/sales/orders', fn () => ['data' => []])->middleware('erp.screen:CRM-ORDER');
            Route::get('/dispatch/shipments', fn () => ['data' => []])->middleware('erp.screen:DSP-LOAD');
            Route::get('/dispatch/pod', fn () => ['data' => []])->middleware('erp.screen:DSP-POD');

            Route::get('/sales/unsold-returns', [UnsoldSalesReturnController::class, 'index'])
                ->middleware('erp.screen:RET-UNSOLD');
            Route::get('/sales/unsold-returns/lookups', [UnsoldSalesReturnController::class, 'lookups'])
                ->middleware('erp.screen:RET-UNSOLD');
            Route::get('/sales/unsold-return-approvals', [UnsoldSalesReturnApprovalController::class, 'index'])
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:APPROVE']);
            Route::get('/sales/unsold-return-approvals/{approvalId}', [UnsoldSalesReturnApprovalController::class, 'show'])
                ->whereUuid('approvalId')
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:APPROVE']);
            Route::post('/sales/unsold-return-approvals/{approvalId}/approve', [UnsoldSalesReturnApprovalController::class, 'approve'])
                ->whereUuid('approvalId')
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:APPROVE']);
            Route::post('/sales/unsold-return-approvals/{approvalId}/reject', [UnsoldSalesReturnApprovalController::class, 'reject'])
                ->whereUuid('approvalId')
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:APPROVE']);
            Route::get('/sales/unsold-returns/{caseId}', [UnsoldSalesReturnController::class, 'show'])
                ->whereUuid('caseId')
                ->middleware('erp.screen:RET-UNSOLD');
            Route::post('/sales/unsold-returns/{caseId}/evidence', [UnsoldSalesReturnEvidenceController::class, 'store'])
                ->whereUuid('caseId')
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:EVIDENCE']);
            Route::get('/sales/unsold-returns/{caseId}/evidence/{evidenceId}', [UnsoldSalesReturnEvidenceController::class, 'download'])
                ->whereUuid('caseId')
                ->whereUuid('evidenceId')
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:EVIDENCE']);
            Route::post('/sales/unsold-returns', [UnsoldSalesReturnController::class, 'store'])
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:CREATE']);
            Route::post('/sales/unsold-returns/{caseId}/receive', [UnsoldSalesReturnController::class, 'receive'])
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:RECEIVE']);
            Route::post('/sales/unsold-returns/{caseId}/disposition', [UnsoldSalesReturnController::class, 'disposition'])
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:DISPOSITION']);
            Route::post('/sales/unsold-returns/{caseId}/post-loss', [UnsoldSalesReturnController::class, 'postLoss'])
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:POST-LOSS']);
            Route::post('/sales/unsold-returns/{caseId}/finance/invoice', [UnsoldSalesReturnFinanceController::class, 'linkInvoice'])
                ->whereUuid('caseId')
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:FINANCE']);
            Route::post('/sales/unsold-returns/{caseId}/finance/credit-note', [UnsoldSalesReturnFinanceController::class, 'creditNote'])
                ->whereUuid('caseId')
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:FINANCE']);
            Route::post('/sales/unsold-returns/{caseId}/finance/tax-adjustment', [UnsoldSalesReturnFinanceController::class, 'taxAdjustment'])
                ->whereUuid('caseId')
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:FINANCE']);
            Route::post('/sales/unsold-returns/{caseId}/finance/receivable-adjustment', [UnsoldSalesReturnFinanceController::class, 'receivableAdjustment'])
                ->whereUuid('caseId')
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:FINANCE']);
            Route::post('/sales/unsold-returns/{caseId}/finance/refund', [UnsoldSalesReturnFinanceController::class, 'refund'])
                ->whereUuid('caseId')
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:FINANCE']);
            Route::post('/sales/unsold-returns/{caseId}/finance/replacement', [UnsoldSalesReturnFinanceController::class, 'replacement'])
                ->whereUuid('caseId')
                ->middleware(['erp.screen:RET-UNSOLD', 'erp.permission:ACTION:RET-UNSOLD:FINANCE']);

            Route::get('/finance/receivables', fn () => ['data' => []])->middleware('erp.screen:FIN-AR');
            Route::get('/finance/payables', fn () => ['data' => []])->middleware('erp.screen:FIN-AP');
            Route::get('/finance/period-close', fn () => ['data' => []])->middleware('erp.screen:FIN-GL');
            Route::get('/finance/simulation', fn () => ['data' => []])->middleware('erp.screen:FIN-SIM');
            Route::get('/finance/legacy-imports', fn () => ['data' => []])->middleware('erp.screen:FIN-LEGACY');

            Route::get('/scale/plants', fn () => ['data' => []])->middleware('erp.screen:SCALE-PLANT');
            Route::get('/partner/workspaces', fn () => ['data' => []])->middleware('erp.screen:PORTAL-EXT');
            Route::get('/optimisation/plans', fn () => ['data' => []])->middleware('erp.screen:OPT-PLAN');
        });
    });
});
