<?php

namespace Tests\Feature;

use Tests\TestCase;

final class HealthEndpointTest extends TestCase
{
    public function test_api_health_endpoint_is_available(): void
    {
        $this->getJson('/api/health')
            ->assertOk()
            ->assertExactJson([
                'status' => 'ok',
                'service' => 'qt-foods-erp-crm',
                'architecture' => 'modular-monolith',
            ]);
    }

    public function test_protected_endpoints_require_authentication(): void
    {
        $this->getJson('/api/v1/contexts')
            ->assertUnauthorized()
            ->assertExactJson([
                'error' => [
                    'code' => 'UNAUTHENTICATED',
                    'message' => 'Unauthenticated.',
                ],
            ]);
    }
}
