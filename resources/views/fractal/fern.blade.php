@extends('layouts.partials.canvas')
<script src="{{ asset('/js/custom/fern.js') }}" defer ></script>
@section('script-items')
<div class="mt-2 col-lg-12">
	<div class="range-slider">
		<label class="range-slider__title" for="">render speed</label>
		<input type="range" class="range-slider__range" id="velocity" min="50" max="250" step="25"  value="75">
		<span class="range-slider__value" id="velocity-value">75</span>
	</div>
	<div class="range-slider">
		<label class="range-slider__title" for="">color</label>
		<input type="range" class="range-slider__range" id="color-input" min="0" max="4" step="1"  value="3">
		<span class="range-slider__value py-2" id="color-value"><i class="bi bi-palette-fill"></i></span>
	</div>
</div>
@endsection