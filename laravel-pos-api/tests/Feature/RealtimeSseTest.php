<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Branch;
use App\Models\User;
use App\Models\RealtimeEvent;
use App\Services\RealtimeBroadcastService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RealtimeSseTest extends TestCase
{
    /**
     * Test : Vérifie qu'un événement inséré par RealtimeBroadcastService
     * respecte l'isolation company_id.
     */
    public function test_realtime_broadcast_service_isolates_by_company(): void
    {
        RealtimeBroadcastService::push(
            eventType: 'cash_session_opened',
            companyId: 10,
            branchId: 5,
            payload: ['session_id' => 999]
        );

        $event = RealtimeEvent::where('company_id', 10)->first();

        $this->assertNotNull($event);
        $this->assertEquals('cash_session_opened', $event->event_type);
        $this->assertEquals(10, $event->company_id);
        $this->assertEquals(5, $event->branch_id);
        $this->assertEquals(999, $event->payload['session_id']);

        // Vérifier que getForUser pour company 11 ne retourne PAS cet événement
        $eventsCompany11 = RealtimeEvent::getForUser(companyId: 11, branchId: 5, userId: 1);
        $this->assertCount(0, $eventsCompany11);

        // Vérifier que getForUser pour company 10 retourne l'événement
        $eventsCompany10 = RealtimeEvent::getForUser(companyId: 10, branchId: 5, userId: 1);
        $this->assertCount(1, $eventsCompany10);
    }

    /**
     * Test : Vérifie la purge automatique des événements expirés.
     */
    public function test_purge_expired_realtime_events(): void
    {
        RealtimeEvent::create([
            'company_id' => 1,
            'event_type' => 'test_expired',
            'payload'    => [],
            'created_at' => now()->subMinutes(10),
            'expires_at' => now()->subMinutes(5),
        ]);

        RealtimeEvent::create([
            'company_id' => 1,
            'event_type' => 'test_valid',
            'payload'    => [],
            'created_at' => now(),
            'expires_at' => now()->addMinutes(5),
        ]);

        RealtimeEvent::purgeExpired();

        $this->assertDatabaseMissing('realtime_events', ['event_type' => 'test_expired']);
        $this->assertDatabaseHas('realtime_events', ['event_type' => 'test_valid']);
    }
}
