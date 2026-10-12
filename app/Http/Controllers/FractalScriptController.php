<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FractalScript;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;



class FractalScriptController extends Controller
{


    /**
     *
     */
    public function index(Request $request)
    {
        $fractals = FractalScript::all();
        return view('fractals.index', ['fractals' => $fractals]);
    }


    /**
     *
     */
    public function show(FractalScript $fractalScript)
    {
        return view('fractals.index', ['script' => $fractalScript]);
    }
}
