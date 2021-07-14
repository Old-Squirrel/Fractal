@extends ('layouts.app')
@section('content')
<div  id="form-create-edit">
    <h2 class="">Edit form</h2>
<form action="{{route('fractals.update', $fractal)}}" method="post">
<input type="hidden" name="_method" value="put">   
{{csrf_field()}} 
<label for="">ID</label>    
<input type="text" name="id" class="form-control" placeholder="id" value="{{$fractal->id}}" readonly>

<label for="">Title</label>
<input type="text" name="title" class="form-control" placeholder="script title" value="{{$fractal->title}}" required>

<label for="">Description</label>
<textarea class="form-control"  name="description" placeholder="implementation description, general information" 
  rows ="3">{{$fractal->description ?? ''}}</textarea>

<label for="">Script name</label>
<input type="text" name="script_name" class="form-control" placeholder="must match the route name" value="{{$fractal->script_name}}" required>

<label for="">Image</label>
<input type="file"  name ="image" class="form-control" placeholder="image" value="{{$fractal->image}}" >

<label class="collapse" id="fractal_props" for="">Default data</label>
<textarea id="fractal_props" rows ="5" name="default_data" class="collapse form-control"
 placeholder="edit default values ">{{$fractal->properties->default_data ?? ''}}</textarea>
<hr>
<button id ="btn-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#fractal_props" aria-expanded="false" 
aria-controls="fractal_props"  title="show">
        <i class="bi bi-three-dots-vertical"></i>
</button>


<input type="submit" value="Save" title = "save">
</form>


</div>
@endsection

