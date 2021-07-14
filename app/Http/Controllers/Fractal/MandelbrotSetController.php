<?php

namespace App\Http\Controllers\Fractal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Fractal;

class MandelbrotSetController extends Controller
{
    protected $fractal = 'mandelbrot-set';
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
        return view("fractal.$this->fractal",[
            'fractal' => Fractal::where('script_name',$this->fractal)->first()
        ]);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

   
}
