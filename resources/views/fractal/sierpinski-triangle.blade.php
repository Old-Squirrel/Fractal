@extends('layouts.partials.canvas')
<script src="{{ asset('/js/custom/sierpinski-triangle.js') }}" defer ></script>
@section('script-items')
<div class="mt-2 col-xl-12">
    <div class="range-slider">
        <label class="range-slider__title" for="counter">number of points</label>
		<input  class ="range-slider__range" type="range"  min="3" max="8" step="1" id="counter" value="3">
        <span class="range-slider__value" id="counter-value">3</span>
     </div>
     <div class="range-slider">
        <label class="range-slider__title" for="divider">divider</label>
		<input class ="range-slider__range"  type="range"  min="0.1" max="1" step="0.1" id="divider" value="0.5">
        <span class="range-slider__value" id="divider-value">0.5</span> 
     </div>
    <div class="range-slider">
		<label class="range-slider__title" for="velocity">render speed</label>
		<input class ="range-slider__range" type="range" min="50" max="250" step="25" id="velocity" value="75">
        <span class="range-slider__value" id="velocity-value">75</span> 
</div>
	</div>
@endsection