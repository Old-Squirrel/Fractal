<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Database\Eloquent\Model;
use App\Models\Comment;
use Livewire\Attributes\Validate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class Comments extends Component
{
    public $model;

    #[Validate('required|string|min:1|max:5000')]
    public $content = '';

    #[Validate('nullable|exists:comments,id')]
    public $parent_id = null;

    // Нові змінні для керування станом редагування
    public $editing_comment_id = null;

    #[Validate('required|string|min:1|max:5000')]
    public $edit_content = '';

    /**
     *
     */
    public function mount($model)
    {
        if (!method_exists($model, 'comments') || !($model instanceof Model)) {
            $error_message = 'Unsupported model instance ' . get_class($model);
            throw new \InvalidArgumentException($error_message);

        }
        $this->model = $model;
    }

    /**
     *
     */
    public function render()
    {
        $comments = $this->model->comments()
            ->with(['user', 'replies.user'])
            ->get();

        return view('livewire.comments', ['comments' => $comments]);
    }

    /**
     *
     */
    public function add()
    {
        if (!Auth::check()) {
            $this->addError('auth', 'Only registered users can add comments');
            return;
        }

        $this->validateOnly('content');

        Comment::create([
            'content'          => $this->content,
            'parent_id'        => $this->parent_id ?: null,
            'user_id'          => Auth::id(),
            'commentable_id'   => $this->model->id,
            'commentable_type' => get_class($this->model)
        ]);

        $this->reset(['content', 'parent_id']);
    }

    /**
     *
     */
    public function startEdit($id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) return;

        $this->editing_comment_id = $id;
        $this->edit_content = $comment->content;
    }

    /**
     *
     */
    public function cancelEdit()
    {
        $this->reset(['editing_comment_id', 'edit_content']);
    }

    /**
     *
     */
    public function edit()
    {
        if (!Auth::check() || !$this->editing_comment_id) {
            return;
        }

        $comment = Comment::findOrFail($this->editing_comment_id);

        if ($comment->user_id !== Auth::id()) {
            $this->addError('auth', 'You can only edit your own comments.');
            return;
        }

        $this->validateOnly('edit_content');

        $comment->update(['content' => $this->edit_content]);

        $this->cancelEdit();
    }

    /**
     *
     */
    public function delete($id)
    {
        if (!Auth::check()) return;

        $comment = Comment::findOrFail($id);

        switch (true) {
            case $comment->user_id === Auth::id() || Gate::allows('admin-permission'):
                $comment->delete();
                if ($this->editing_comment_id === $id) $this->cancelEdit();
                break;
            default:
                $this->addError('auth', 'You do not have permission to delete this comment.');
                break;
        }
    }

    /**
     *
     */
    public function setReplyTo($id)
    {
        $this->parent_id = $id;
    }

    /**
     *
     */
    public function cancelReply()
    {
        $this->parent_id = null;
    }
}
