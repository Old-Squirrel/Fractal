@extends ('layouts.app')
@section('content')
<div  id="form-create-edit">
    <h2>Creating form</h2>
<form action="{{route('fractals.store')}}" method="post">
    {{csrf_field()}}   

<label for="">Title</label>
<input type="text" class="form-control" name="title" placeholder="script title" required>

<label for="">Description</label>
<textarea class="form-control" name="description"  placeholder="implementation description, general information"  rows ="5"></textarea>

<label for="">Script name</label>
<input type="text" class="form-control" name="script_name" placeholder="must match the route name ">

<label for="">Image</label>
<input type="file" class="form-control" placeholder="image" name="image">

<label class="collapse" id="fractal_props" name="default_data" for="fractal_props">Default data</label>
<textarea id="fractal_props" rows ="5" name="default_data" class="collapse form-control"
    placeholder="set default values">
</textarea>
<hr>
<button type="button" data-bs-toggle="collapse" data-bs-target="#fractal_props" aria-expanded="false" aria-controls="fractal_props" title="properties">
        <i class="bi bi-three-dots-vertical"></i>
</button>

<input  type="submit" value="Save" title = "save">
</form>
</div>
@endsection