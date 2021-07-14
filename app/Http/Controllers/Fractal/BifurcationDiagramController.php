<?php

namespace App\Http\Controllers\Fractal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Fractal;

class BifurcationDiagramController extends Controller
{
    protected $fractal = 'bifurcation-diagram';
    
    public function index(){
      
        return view("fractal.$this->fractal",[
            'fractal' => Fractal::where('script_name', $this->fractal)->first()
        ]);
    }
}
