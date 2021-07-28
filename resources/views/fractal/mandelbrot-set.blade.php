@extends('layouts.partials.canvas')
<script src="{{ asset('/js/custom/mandelbrot-set.js') }} " defer></script>
@section('script-items')
<select id="mode-select">
  <option selected>select mode</option>
  <option value="2">z&sup2+c</option>
  <option value="3">z&sup3+c</option>
  <option value="5">z^5+c </option>
</select>
<div class="input-group mt-2">
  <span class="input-group-text">Scale</span>
  <input type="text" id="set-scale">
</div>

<div class="input-group">
  <span class="input-group-text">X</span>
  <input type="text" id="set-coord-x">
</div>
<div class="input-group mb-3">
  <span class="input-group-text">Y</span>
  <input type="text" id="set-coord-y">
</div>
@endsection