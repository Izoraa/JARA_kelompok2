<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityFeatureTest extends TestCase
{
    use RefreshDatabase;

    /**
     * SRS-SEC-01: Memvalidasi dan menolak permintaan dari pengguna tidak berwenang (403 Forbidden / Redirect to Login).
     */
    public function test_unauthenticated_user_cannot_access_projects(): void
    {
        $project = Project::factory()->create();

        $response = $this->get(route('projects.show', $project));

        $response->assertRedirect('/login');
    }

    public function test_unauthorized_user_cannot_view_other_user_project(): void
    {
        $owner = User::factory()->create();
        $unauthorizedUser = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($unauthorizedUser)->get(route('projects.show', $project));

        $response->assertStatus(403);
    }

    public function test_authorized_owner_can_view_own_project(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($owner)->get(route('projects.show', $project));

        $response->assertOk();
    }

    public function test_non_admin_user_cannot_access_admin_dashboard(): void
    {
        $regularUser = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($regularUser)->get(route('admin.users.index'));

        $response->assertStatus(403);
    }

    public function test_admin_user_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get(route('admin.users.index'));

        $response->assertOk();
    }

    /**
     * SRS-SEC-02: Memvalidasi seluruh input pengguna dan menggunakan prepared statement.
     */
    public function test_registration_input_validation_rejects_invalid_data(): void
    {
        $response = $this->post('/register', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => 'short',
            'password_confirmation' => 'mismatch',
        ]);

        $response->assertSessionHasErrors(['name', 'email', 'password']);
    }

    public function test_sql_injection_payload_is_safely_handled_via_parameterized_queries(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $owner->id]);

        $sqlPayload = "' OR '1'='1' --";

        $response = $this->actingAs($owner)->post(route('projects.members.store', $project), [
            'username' => $sqlPayload,
        ]);

        // Input divalidasi dan diproses dengan parameterized query; tidak menyebabkan error SQL atau mengembalikan user tak sah
        $response->assertSessionHasErrors(['username']);
    }
}
