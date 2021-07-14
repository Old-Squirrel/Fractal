<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fractal extends Model
{
   protected $fillable=[
   'title',
   'description',
   'script_name',
   'updated_at',
   'created_at'
];

   public function properties(){
      return $this->hasOne(Property::class);
   }
}
