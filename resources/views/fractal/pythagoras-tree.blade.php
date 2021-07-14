@extends('layouts.partials.canvas')
<script src="{{ asset('/js/custom/pythagoras-tree.js') }} " defer ></script>
@section('script-items')
<select id="mode-select">
                <option selected>select mode</option>
                <option value="2">2 branches</option>
                <option value="3">3 branches</option>
</select>    
@endsection