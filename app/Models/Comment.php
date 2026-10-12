<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Models\FractalScript;
use Dom\Comment as DomComment;

class Comment extends Model
{
    protected $fillable = ['user_id', 'parent_id', 'content', 'commentable_id', 'commentable_type'];

    /**
     *
     */
    public function commentable():MorphTo{
        return $this->morphTo();
    }

    /**
     *
     */
    public function user(){
        return $this->belongsTo(User::class);
    }

    /**
     *
     */
    public function parent(){
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    /**
     *
     */
    public function replies():HasMany{
        return $this->hasMany(Comment::class, 'parent_id')->orderBy('updated_at', 'asc');
    }

}
