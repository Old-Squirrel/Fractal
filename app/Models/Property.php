<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
    'fractal_id',
    'default_data',
    'calculated_data',
    'updated_at',
    'created_at'
];

    public function fractals(){
        return $this->belongsTo(Fractal::class);
    }
}
