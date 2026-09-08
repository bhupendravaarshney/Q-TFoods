<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

final class UnsoldReturnReferenceSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $companyId = '00000000-0000-4000-8000-000000000001';
        $trainingPlantId = '00000000-0000-4000-8000-000000000101';
        $financePlantId = '00000000-0000-4000-8000-000000000102';

        DB::table('uoms')->updateOrInsert(['code' => 'PACK'], [
            'name' => 'Pack',
            'precision' => 0,
        ]);

        $parties = [
            ['00000000-0000-4000-8000-000000000501', 'DIST-NORTH', 'North Market Distributor'],
            ['00000000-0000-4000-8000-000000000502', 'DIST-CENTRAL', 'Central Retail Distribution'],
        ];
        foreach ($parties as [$id, $code, $name]) {
            DB::table('parties')->updateOrInsert(['id' => $id], [
                'company_id' => $companyId,
                'code' => $code,
                'display_name' => $name,
                'status' => 'ACTIVE',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $items = [
            ['00000000-0000-4000-8000-000000000601', 'SKU-APPLE-100', 'Apple Snack Pack 100g'],
            ['00000000-0000-4000-8000-000000000602', 'SKU-MILLET-150', 'Millet Crunch Pack 150g'],
        ];
        foreach ($items as [$id, $code, $name]) {
            DB::table('items')->updateOrInsert(['id' => $id], [
                'company_id' => $companyId,
                'code' => $code,
                'name' => $name,
                'item_type' => 'FINISHED_GOOD',
                'base_uom' => 'PACK',
                'status' => 'ACTIVE',
                'record_version' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $lots = [
            ['00000000-0000-4000-8000-000000000701', $items[0][0], 'FG-APPLE-2608A', '2026-08-15', '2027-02-15'],
            ['00000000-0000-4000-8000-000000000702', $items[1][0], 'FG-MILLET-2608B', '2026-08-18', '2027-02-18'],
        ];
        foreach ($lots as [$id, $itemId, $code, $manufactured, $expires]) {
            DB::table('lots')->updateOrInsert(['id' => $id], [
                'company_id' => $companyId,
                'item_id' => $itemId,
                'internal_lot_code' => $code,
                'supplier_lot_code' => null,
                'manufacture_date' => $manufactured,
                'expiry_date' => $expires,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $locations = [
            ['00000000-0000-4000-8000-000000000801', $trainingPlantId, 'RET-QA', 'Return Quarantine', 'RETURN_QUARANTINE'],
            ['00000000-0000-4000-8000-000000000802', $financePlantId, 'RET-FIN', 'Finance Review Return Hold', 'RETURN_QUARANTINE'],
            ['00000000-0000-4000-8000-000000000803', $trainingPlantId, 'FG-SALE', 'Saleable Finished Goods', 'FINISHED_GOODS'],
            ['00000000-0000-4000-8000-000000000804', $trainingPlantId, 'REP-HOLD', 'Repack Hold', 'REPACK'],
            ['00000000-0000-4000-8000-000000000805', $trainingPlantId, 'REW-HOLD', 'Rework Hold', 'REWORK'],
            ['00000000-0000-4000-8000-000000000806', $financePlantId, 'FG-SALE', 'Saleable Finished Goods', 'FINISHED_GOODS'],
            ['00000000-0000-4000-8000-000000000807', $financePlantId, 'REP-HOLD', 'Repack Hold', 'REPACK'],
            ['00000000-0000-4000-8000-000000000808', $financePlantId, 'REW-HOLD', 'Rework Hold', 'REWORK'],
        ];
        foreach ($locations as [$id, $plantId, $code, $name, $locationType]) {
            DB::table('locations')->updateOrInsert(['id' => $id], [
                'company_id' => $companyId,
                'plant_id' => $plantId,
                'code' => $code,
                'name' => $name,
                'location_type' => $locationType,
                'status' => 'ACTIVE',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $shipments = [
            ['00000000-0000-4000-8000-000000001001', $trainingPlantId, 'SHP-2026-0001', $parties[0][0], 'DELIVERED', '2026-09-01 08:30:00'],
            ['00000000-0000-4000-8000-000000001002', $trainingPlantId, 'SHP-2026-0002', $parties[1][0], 'DISPATCHED', '2026-09-05 09:15:00'],
            ['00000000-0000-4000-8000-000000001003', $financePlantId, 'SHP-2026-0003', $parties[0][0], 'DELIVERED', '2026-09-02 10:00:00'],
        ];
        foreach ($shipments as [$id, $plantId, $number, $partyId, $status, $dispatchedAt]) {
            DB::table('shipments')->updateOrInsert(['id' => $id], [
                'company_id' => $companyId,
                'plant_id' => $plantId,
                'shipment_number' => $number,
                'party_id' => $partyId,
                'status' => $status,
                'dispatched_at' => $dispatchedAt,
                'record_version' => 1,
                'created_by' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $invoices = [
            ['00000000-0000-4000-8000-000000001301', $trainingPlantId, $parties[0][0], $shipments[0][0], 'INV-2026-0001', 'POSTED', '10000', '1800', '11800', '4000', '2026-09-01 12:00:00'],
            ['00000000-0000-4000-8000-000000001302', $trainingPlantId, $parties[1][0], $shipments[1][0], 'INV-2026-0002', 'POSTED', '6000', '1080', '7080', '7080', '2026-09-05 13:00:00'],
            ['00000000-0000-4000-8000-000000001303', $financePlantId, $parties[0][0], $shipments[2][0], 'INV-2026-0003', 'PAID', '3000', '540', '3540', '0', '2026-09-02 14:00:00'],
        ];
        foreach ($invoices as [$id, $plantId, $partyId, $shipmentId, $number, $status, $net, $tax, $gross, $outstanding, $issuedAt]) {
            DB::table('invoices')->updateOrInsert(['id' => $id], [
                'company_id' => $companyId,
                'plant_id' => $plantId,
                'status' => $status,
                'record_version' => 1,
                'created_by' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('sales_invoice_financials')->updateOrInsert(['invoice_id' => $id], [
                'company_id' => $companyId,
                'plant_id' => $plantId,
                'party_id' => $partyId,
                'shipment_id' => $shipmentId,
                'invoice_number' => $number,
                'currency' => 'INR',
                'net_amount' => $net,
                'tax_amount' => $tax,
                'gross_amount' => $gross,
                'outstanding_amount' => $outstanding,
                'issued_at' => $issuedAt,
                'record_version' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $shipmentLines = [
            ['00000000-0000-4000-8000-000000001101', $shipments[0][0], $trainingPlantId, $items[0][0], $lots[0][0], '120', '20'],
            ['00000000-0000-4000-8000-000000001102', $shipments[1][0], $trainingPlantId, $items[1][0], $lots[1][0], '80', '0'],
            ['00000000-0000-4000-8000-000000001103', $shipments[2][0], $financePlantId, $items[0][0], $lots[0][0], '40', '0'],
        ];
        foreach ($shipmentLines as [$id, $shipmentId, $plantId, $itemId, $lotId, $shipped, $returned]) {
            DB::table('shipment_lines')->updateOrInsert(['id' => $id], [
                'shipment_id' => $shipmentId,
                'company_id' => $companyId,
                'plant_id' => $plantId,
                'item_id' => $itemId,
                'fg_lot_id' => $lotId,
                'shipped_quantity' => $shipped,
                'returned_quantity' => $returned,
                'uom_code' => 'PACK',
                'record_version' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $positions = [
            ['00000000-0000-4000-8000-000000001201', $trainingPlantId, $items[0][0], $lots[0][0], $locations[0][0], 'RETURN_QUARANTINE'],
            ['00000000-0000-4000-8000-000000001202', $trainingPlantId, $items[1][0], $lots[1][0], $locations[0][0], 'RETURN_QUARANTINE'],
            ['00000000-0000-4000-8000-000000001203', $financePlantId, $items[0][0], $lots[0][0], $locations[1][0], 'RETURN_QUARANTINE'],
            ['00000000-0000-4000-8000-000000001204', $trainingPlantId, $items[0][0], $lots[0][0], $locations[2][0], 'RELEASED'],
            ['00000000-0000-4000-8000-000000001205', $trainingPlantId, $items[0][0], $lots[0][0], $locations[3][0], 'REPACK_HOLD'],
            ['00000000-0000-4000-8000-000000001206', $trainingPlantId, $items[0][0], $lots[0][0], $locations[4][0], 'REWORK_HOLD'],
            ['00000000-0000-4000-8000-000000001207', $trainingPlantId, $items[1][0], $lots[1][0], $locations[2][0], 'RELEASED'],
            ['00000000-0000-4000-8000-000000001208', $trainingPlantId, $items[1][0], $lots[1][0], $locations[3][0], 'REPACK_HOLD'],
            ['00000000-0000-4000-8000-000000001209', $trainingPlantId, $items[1][0], $lots[1][0], $locations[4][0], 'REWORK_HOLD'],
            ['00000000-0000-4000-8000-000000001210', $financePlantId, $items[0][0], $lots[0][0], $locations[5][0], 'RELEASED'],
            ['00000000-0000-4000-8000-000000001211', $financePlantId, $items[0][0], $lots[0][0], $locations[6][0], 'REPACK_HOLD'],
            ['00000000-0000-4000-8000-000000001212', $financePlantId, $items[0][0], $lots[0][0], $locations[7][0], 'REWORK_HOLD'],
        ];
        foreach ($positions as [$id, $plantId, $itemId, $lotId, $locationId, $qualityStatus]) {
            DB::table('stock_positions')->updateOrInsert(['id' => $id], [
                'company_id' => $companyId,
                'plant_id' => $plantId,
                'item_id' => $itemId,
                'lot_id' => $lotId,
                'owner_party_id' => null,
                'location_id' => $locationId,
                'quality_status' => $qualityStatus,
                'quantity_base' => 0,
                'uom_code' => 'PACK',
                'record_version' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
