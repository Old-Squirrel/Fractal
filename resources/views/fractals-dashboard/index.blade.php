@extends ('layouts.app')
@section('content')
<div class="container ">

<div class="col-9 mx-auto">
<h2 class="text-center text-light">Scripts List</h2>
<a href="{{route('fractals.create')}}" role="button" class="btn btn-outline-secondary" title="create">Add new field</a>
<table id="form-list">
<thead>
<tr>
<th scope="col" >id</th>
<th scope="col" class="text-center">Title</th>
<th scope="col" class="text-end">Edit</th>
<th scope="col" class="text-end" >delete</th>
</tr>
</thead>
<tbody>
@forelse($fractals as $fractal)
<tr scope="row">
<td>{{$fractal->id}}</td>
<td class="text-center"><a href="{{route($fractal->script_name)}}">{{$fractal->title}}</a></td>
<td class="text-end"><a  href="{{route('fractals.edit', $fractal->id)}}" role="button" class="btn btn-outline-warning" title="edit">
<i class="bi bi-pencil-fill"></i></a></td>
<td  class="text-end">
<form action="{{route('fractals.destroy',$fractal)}}" method="post" onsubmit="if(confirm('Are You Sure?')){return true}else{return false}">
<input type="hidden" name="_method" value="DELETE">
{{csrf_field()}}    

   <button class="btn btn-outline-danger" title="delete" type="submit"><i class="bi bi-trash"></i></button> 

</form>
</td>
</tr>

@empty
            <tr>
                <td colspan="4" class="text-center"><h3>No data yet</h3></td>
            </tr>
@endforelse


<tr scope="row">
<td colspan="4">
<a href="{{route('fractals.create')}}" role="button"  title="add new field" id="add-btn"><i class="bi bi-plus-square-fill"></i></a>
</td>
</tr>
</tbody>
</table>
</div>
</div>
@endsection