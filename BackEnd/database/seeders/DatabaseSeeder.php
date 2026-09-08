<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $now = now();
            $companyId = '00000000-0000-4000-8000-000000000001';
            $trainingPlantId = '00000000-0000-4000-8000-000000000101';
            $financePlantId = '00000000-0000-4000-8000-000000000102';

            DB::table('companies')->updateOrInsert(['id' => $companyId], [
                'code' => 'QTF',
                'legal_name' => 'Q & T FOODS LTD',
                'display_name' => 'Q & T FOODS LTD',
                'status' => 'ACTIVE',
                'record_version' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            foreach ([
                [$trainingPlantId, 'TRAINING', 'Training Plant'],
                [$financePlantId, 'FIN-REVIEW', 'Finance Review'],
            ] as [$plantId, $code, $name]) {
                DB::table('plants')->updateOrInsert(['id' => $plantId], [
                    'company_id' => $companyId,
                    'code' => $code,
                    'name' => $name,
                    'timezone' => 'Asia/Kolkata',
                    'status' => 'ACTIVE',
                    'record_version' => 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            $users = [
                'sales' => ['00000000-0000-4000-8000-000000000201', 'demo.user@qtfoods.local', 'Demo Sales Manager'],
                'operations' => ['00000000-0000-4000-8000-000000000202', 'operations.user@qtfoods.local', 'Demo Operations Manager'],
                'finance' => ['00000000-0000-4000-8000-000000000203', 'finance.user@qtfoods.local', 'Demo Finance Reviewer'],
                'admin' => ['00000000-0000-4000-8000-000000000204', 'admin.user@qtfoods.local', 'Demo ERP Administrator'],
            ];

            foreach ($users as [$id, $email, $name]) {
                DB::table('users')->updateOrInsert(['id' => $id], [
                    'email' => $email,
                    'name' => $name,
                    'password_hash' => Hash::make('prototype'),
                    'status' => 'ACTIVE',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            $roles = [
                'SALES_MANAGER' => ['00000000-0000-4000-8000-000000000301', 'Sales Manager'],
                'OPERATIONS_MANAGER' => ['00000000-0000-4000-8000-000000000302', 'Operations Manager'],
                'FINANCE_REVIEWER' => ['00000000-0000-4000-8000-000000000303', 'Finance Reviewer'],
                'ERP_ADMIN' => ['00000000-0000-4000-8000-000000000304', 'ERP Administrator'],
            ];

            foreach ($roles as $code => [$id, $name]) {
                DB::table('roles')->updateOrInsert(['id' => $id], [
                    'code' => $code,
                    'name' => $name,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            $allScreens = [
                'WRK-HOME',
                'ADM-ORG', 'ADM-LOC', 'ADM-USER', 'ADM-ROLE', 'ADM-RULE', 'ADM-AUD', 'ADM-INT', 'ADM-HELP', 'BI-REP',
                'MD-PARTY', 'MD-BRAND', 'MD-ITEM', 'MD-SKU', 'PUR-REQ', 'PUR-RFQ', 'PUR-PO', 'INB-GATE', 'INB-GRN',
                'QC-IN', 'INB-RETURN', 'INV-STK', 'INV-ISS', 'INV-TRF', 'INV-COUNT', 'INV-EXP', 'MD-REC', 'MD-ROUTE', 'MD-SPEC',
                'PLAN-DEM', 'PLAN-MRP', 'PLAN-SCH', 'PRO-ORDER', 'PRO-STAGE', 'PRO-LOSS', 'QC-LAB', 'QC-SAFE', 'PACK-ART',
                'PACK-RUN', 'FG-LOT', 'TRACE-CASE', 'COST-BATCH', 'CRM-LEAD', 'CRM-PRICE', 'CRM-ORDER', 'CON-WORK',
                'DSP-PICK', 'DSP-LOAD', 'DSP-POD', 'RET-CASE', 'RET-UNSOLD', 'FIN-AR', 'BI-PROFIT', 'FIN-AP', 'FIN-EXP',
                'FIN-GL', 'COST-OH', 'ASSET-REG', 'HR-PAY', 'ENG-MNT', 'SCALE-PLANT', 'PORTAL-EXT', 'OPT-PLAN',
                'FIN-SIM', 'FIN-ADJ', 'FIN-LEGACY', 'FIN-ARCH', 'FIN-OPEN', 'FIN-SUP',
            ];

            $roleScreens = [
                'SALES_MANAGER' => [
                    'WRK-HOME', 'CRM-LEAD', 'CRM-PRICE', 'CRM-ORDER', 'CON-WORK', 'DSP-PICK', 'DSP-LOAD',
                    'DSP-POD', 'RET-CASE', 'RET-UNSOLD', 'FIN-AR', 'BI-PROFIT', 'ADM-HELP',
                ],
                'OPERATIONS_MANAGER' => [
                    'WRK-HOME', 'MD-PARTY', 'MD-BRAND', 'MD-ITEM', 'MD-SKU', 'PUR-REQ', 'PUR-RFQ', 'PUR-PO',
                    'INB-GATE', 'INB-GRN', 'QC-IN', 'INB-RETURN', 'INV-STK', 'INV-ISS', 'INV-TRF', 'INV-COUNT',
                    'INV-EXP', 'MD-REC', 'MD-ROUTE', 'MD-SPEC', 'PLAN-DEM', 'PLAN-MRP', 'PLAN-SCH', 'PRO-ORDER',
                    'PRO-STAGE', 'PRO-LOSS', 'QC-LAB', 'QC-SAFE', 'PACK-ART', 'PACK-RUN', 'FG-LOT', 'TRACE-CASE',
                    'COST-BATCH', 'RET-UNSOLD', 'ENG-MNT', 'SCALE-PLANT', 'ADM-HELP',
                ],
                'FINANCE_REVIEWER' => [
                    'WRK-HOME', 'BI-REP', 'BI-PROFIT', 'FIN-AR', 'FIN-AP', 'FIN-EXP', 'FIN-GL', 'COST-OH',
                    'COST-BATCH', 'ASSET-REG', 'HR-PAY', 'FIN-SIM', 'FIN-ADJ', 'FIN-LEGACY', 'FIN-ARCH',
                    'FIN-OPEN', 'FIN-SUP', 'RET-UNSOLD', 'ADM-HELP',
                ],
                'ERP_ADMIN' => $allScreens,
            ];

            $permissionIds = [];
            foreach ($allScreens as $screenCode) {
                $permissionCode = "SCREEN:{$screenCode}:VIEW";
                $permissionId = DB::table('permissions')->where('code', $permissionCode)->value('id')
                    ?: (string) Str::uuid();

                DB::table('permissions')->updateOrInsert(['code' => $permissionCode], [
                    'id' => $permissionId,
                    'name' => "View {$screenCode}",
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $permissionIds[$screenCode] = $permissionId;
            }

            foreach ($roleScreens as $roleCode => $screens) {
                $roleId = $roles[$roleCode][0];
                DB::table('role_permissions')->where('role_id', $roleId)->delete();
                DB::table('role_permissions')->insert(array_map(
                    fn (string $screenCode) => [
                        'role_id' => $roleId,
                        'permission_id' => $permissionIds[$screenCode],
                    ],
                    $screens
                ));
            }

            $roleActions = [
                'SALES_MANAGER' => [
                    'ACTION:RET-UNSOLD:CREATE',
                    'ACTION:RET-UNSOLD:EVIDENCE',
                ],
                'OPERATIONS_MANAGER' => [
                    'ACTION:RET-UNSOLD:RECEIVE',
                    'ACTION:RET-UNSOLD:DISPOSITION',
                    'ACTION:RET-UNSOLD:EVIDENCE',
                ],
                'FINANCE_REVIEWER' => [
                    'ACTION:RET-UNSOLD:APPROVE',
                    'ACTION:RET-UNSOLD:POST-LOSS',
                    'ACTION:RET-UNSOLD:FINANCE',
                    'ACTION:RET-UNSOLD:EVIDENCE',
                ],
                'ERP_ADMIN' => [
                    'ACTION:RET-UNSOLD:CREATE',
                    'ACTION:RET-UNSOLD:RECEIVE',
                    'ACTION:RET-UNSOLD:DISPOSITION',
                    'ACTION:RET-UNSOLD:APPROVE',
                    'ACTION:RET-UNSOLD:POST-LOSS',
                    'ACTION:RET-UNSOLD:FINANCE',
                    'ACTION:RET-UNSOLD:EVIDENCE',
                ],
            ];

            foreach ($roleActions as $roleCode => $permissions) {
                $rows = [];
                foreach ($permissions as $permissionCode) {
                    $permissionId = DB::table('permissions')->where('code', $permissionCode)->value('id')
                        ?: (string) Str::uuid();

                    DB::table('permissions')->updateOrInsert(['code' => $permissionCode], [
                        'id' => $permissionId,
                        'name' => str_replace(['ACTION:', ':', '-'], ['', ' ', ' '], $permissionCode),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                    $rows[] = [
                        'role_id' => $roles[$roleCode][0],
                        'permission_id' => $permissionId,
                    ];
                }
                DB::table('role_permissions')->insert($rows);
            }

            $assignments = [
                ['00000000-0000-4000-8000-000000000401', $users['sales'][0], $roles['SALES_MANAGER'][0], $trainingPlantId],
                ['00000000-0000-4000-8000-000000000402', $users['operations'][0], $roles['OPERATIONS_MANAGER'][0], $trainingPlantId],
                ['00000000-0000-4000-8000-000000000403', $users['finance'][0], $roles['FINANCE_REVIEWER'][0], $financePlantId],
                ['00000000-0000-4000-8000-000000000404', $users['admin'][0], $roles['ERP_ADMIN'][0], $trainingPlantId],
                ['00000000-0000-4000-8000-000000000405', $users['admin'][0], $roles['ERP_ADMIN'][0], $financePlantId],
                ['00000000-0000-4000-8000-000000000406', $users['finance'][0], $roles['FINANCE_REVIEWER'][0], $trainingPlantId],
            ];

            foreach ($assignments as [$id, $userId, $roleId, $plantId]) {
                DB::table('role_assignments')->updateOrInsert(['id' => $id], [
                    'user_id' => $userId,
                    'role_id' => $roleId,
                    'company_id' => $companyId,
                    'plant_id' => $plantId,
                    'party_id' => null,
                    'is_active' => true,
                    'effective_from' => null,
                    'effective_to' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            $this->call(UnsoldReturnReferenceSeeder::class);
        });
    }
}
