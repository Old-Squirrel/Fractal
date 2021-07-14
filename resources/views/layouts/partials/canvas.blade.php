@extends('layouts.app')
@section('content')
<div id="fractal_main-box">
    <div class="row justify-content-center">
        <div id="fractal_dashboard">
            @include('layouts.partials.control-buttons', $fractal)
		    @yield('script-items')         
     </div>
                    <div class="col-xl-9">
                        <div id="fractal_title-box">
                            <h2 class="text-info text-center">{{$fractal->title}}</h2>
                        </div>

                        <div  id="fractal_canvas-box">
                            <div id="fractal_canvas-zoom">

                                <i class="bi bi-zoom-in" role="button" id="zoom-in-btn" title="zoom-in"></i>
                                <i class="bi bi-zoom-out" role="button" id="zoom-out-btn" title="zoom-out"></i>

                            </div>
                            <canvas id="layer" width=1000 height = 1000></canvas>
                    </div>
                </div>
            </div>
        </div>
@endsection


