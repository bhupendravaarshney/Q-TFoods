<?php

return [
    'require_idempotency' => env('QT_REQUIRE_IDEMPOTENCY', true),
    'require_maker_checker' => env('QT_REQUIRE_MAKER_CHECKER', true),
    'simulation_isolated' => env('QT_SIMULATION_ISOLATED', true),
    'evidence_disk' => env('QT_EVIDENCE_DISK', 'evidence'),
    'evidence_retention_years' => (int) env('QT_EVIDENCE_RETENTION_YEARS', 7),
    'evidence_retention_policy' => env('QT_EVIDENCE_RETENTION_POLICY', 'UNSOLD_RETURN_7Y'),
    'evidence_max_upload_kilobytes' => (int) env('QT_EVIDENCE_MAX_UPLOAD_KB', 10240),

    'screen_areas' => [
        'foundation',
        'master_data',
        'procurement',
        'inventory',
        'manufacturing',
        'sales',
        'dispatch',
        'finance',
        'support',
        'scale',
    ],
];
