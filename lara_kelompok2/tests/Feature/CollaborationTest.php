<?php

use App\Models\Project;
use App\Models\Task;
use App\Models\User;

function createUser(array $attributes = []): User {
    return User::create(array_merge([
        'name' => fake()->name(),
        'email' => fake()->unique()->safeEmail(),
        'password' => 'password123',
        'role' => 'user',
    ], $attributes));
}

// SRS-COL-01: Pemilik Daftar dapat menambahkan anggota tim lain ke dalam daftar tugas
test('SRS-COL-01: pemilik daftar dapat menambahkan anggota tim lain ke dalam daftar tugas', function () {
    $owner = createUser();
    $member = createUser();

    $project = Project::create([
        'user_id' => $owner->id,
        'name' => 'Project Kolaborasi A',
        'description' => 'Deskripsi Kolaborasi',
    ]);

    $response = $this->actingAs($owner)->post(route('projects.members.store', $project), [
        'username' => $member->email,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('project_members', [
        'project_id' => $project->id,
        'user_id' => $member->id,
    ]);
});

test('SRS-COL-01: bukan pemilik daftar tidak dapat menambahkan anggota tim', function () {
    $owner = createUser();
    $otherUser = createUser();
    $newMember = createUser();

    $project = Project::create([
        'user_id' => $owner->id,
        'name' => 'Project Kolaborasi B',
    ]);

    $response = $this->actingAs($otherUser)->post(route('projects.members.store', $project), [
        'username' => $newMember->email,
    ]);

    $response->assertForbidden();
});

// SRS-COL-02: Sebagai Pengguna/Pemilik Daftar, dapat menugaskan satu tugas kepada lebih dari satu anggota tim
test('SRS-COL-02: dapat menugaskan satu tugas kepada lebih dari satu anggota tim', function () {
    $owner = createUser();
    $member1 = createUser();
    $member2 = createUser();

    $project = Project::create([
        'user_id' => $owner->id,
        'name' => 'Project Tim C',
    ]);
    $project->members()->attach([$member1->id, $member2->id]);

    $task = $project->tasks()->create([
        'title' => 'Tugas Bersama Fitur A',
        'priority' => 'high',
    ]);

    // Tugaskan task ke member1 dan member2 sekaligus
    $response = $this->actingAs($owner)->post(route('tasks.assign', $task), [
        'users' => [$member1->id, $member2->id],
    ]);

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('task_user', [
        'task_id' => $task->id,
        'user_id' => $member1->id,
    ]);
    $this->assertDatabaseHas('task_user', [
        'task_id' => $task->id,
        'user_id' => $member2->id,
    ]);

    expect($task->fresh()->users)->toHaveCount(2);
});

test('SRS-COL-02: user di luar anggota project tidak dapat ditugaskan', function () {
    $owner = createUser();
    $stranger = createUser();

    $project = Project::create([
        'user_id' => $owner->id,
        'name' => 'Project Tim D',
    ]);

    $task = $project->tasks()->create([
        'title' => 'Tugas Eksklusif',
        'priority' => 'medium',
    ]);

    $response = $this->actingAs($owner)->post(route('tasks.assign', $task), [
        'users' => [$stranger->id],
    ]);

    $response->assertSessionHasErrors(['users']);
});

// SRS-COL-03: Sebagai Pemilik Daftar, saya dapat memantau progres penyelesaian seluruh tugas di dalam daftar tersebut
test('SRS-COL-03: pemilik daftar dapat memantau progres penyelesaian tugas di dalam daftar', function () {
    $owner = createUser();

    $project = Project::create([
        'user_id' => $owner->id,
        'name' => 'Project Monitoring',
    ]);

    // Buat 4 tasks: 3 selesai, 1 belum selesai -> progres harus 75%
    $project->tasks()->createMany([
        ['title' => 'Task 1', 'priority' => 'medium', 'is_completed' => true],
        ['title' => 'Task 2', 'priority' => 'medium', 'is_completed' => true],
        ['title' => 'Task 3', 'priority' => 'medium', 'is_completed' => true],
        ['title' => 'Task 4', 'priority' => 'medium', 'is_completed' => false],
    ]);

    $response = $this->actingAs($owner)->get(route('projects.tasks.index', $project));

    $response->assertOk();

    $response->assertInertia(fn ($page) => $page
        ->component('Tasks/Index')
        ->where('progress.total', 4)
        ->where('progress.completed', 3)
        ->where('progress.pending', 1)
        ->where('progress.percentage', 75)
    );
});
