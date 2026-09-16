<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class CollaborationController extends Controller
{

    public function assignTask(Request $request, Task $task)
    {

        $request->validate([
            'users' => 'required|array'
        ]);


        $task->users()->sync(
            $request->users
        );


        return back();

    }

}