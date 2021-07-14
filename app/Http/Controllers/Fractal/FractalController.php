<?php

namespace App\Http\Controllers\Fractal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Fractal;
use App\Models\Property;

class FractalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('fractals-dashboard.index',[
            'fractals' => Fractal::get()]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('fractals-dashboard.create',[
            'fractal' =>[]
            ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $fractal = Fractal::create($request->all());
        Property::create([
                'fractal_id' => $fractal->id,
                'default_data' => $request->input('default_data')
            ]);

        
       return redirect()->route('fractals.index');   
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $fractal = Fractal::with('properties')->where('id',$id)->first();
        return view('fractals-dashboard.edit',[
            'fractal' => $fractal
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Fractal $fractal
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,Fractal $fractal)
    {
        $fractal->update($request->all());
        $fractal->properties()->update([
            'default_data' => $request->input('default_data')
        ]);
        return redirect()->route('fractals.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Fractal $fractal
     * @return \Illuminate\Http\Response
     */
    public function destroy(Fractal $fractal)
    {
        $fractal->delete();
        $fractal->properties()->delete();
       return redirect()->route('fractals.index');
    }
}
