<h2>
    Tambah Anggota :
    {{ $project->name }}
</h2>


<form method="POST" action="/projects/{{ $project->id }}/members">

    @csrf


    <select name="user_id">

        @foreach ($users as $user)
            <option value="{{ $user->id }}">
                {{ $user->name }}
            </option>
        @endforeach

    </select>


    <button>
        Tambah
    </button>


</form>


<hr>


<h3>
    Anggota Saat Ini
</h3>


@foreach ($project->members as $member)
    <p>
        {{ $member->name }}
        -
        {{ $member->pivot->role }}
    </p>
@endforeach
