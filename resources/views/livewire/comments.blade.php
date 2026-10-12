<div class="w-full bg-gray-900 bg-opacity-40 p-6 rounded-lg border border-gray-800 mt-6 col-span-full">
    <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <i class="bi bi-chat-left-text"></i> Comments & Discussions
    </h3>
    @error('auth')
        <div class="mb-4 p-3 bg-red-950 bg-opacity-40 border border-red-900 rounded-lg text-sm text-red-400">
            {{ $message }}
        </div>
    @enderror
    <div class="space-y-4 max-h-[500px] overflow-y-auto mb-6 pr-2">
        @forelse($comments as $comment)
            <div class="p-4 bg-gray-800 bg-opacity-60 border border-gray-700 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-medium text-emerald-400 text-sm">{{ $comment->user->name }}</span>
                    <span class="text-xs text-gray-400">{{ $comment->updated_at->diffForHumans() }}</span>
                </div>

                @if($editing_comment_id === $comment->id)
                    <form wire:submit.prevent="edit" class="space-y-2">
                        <textarea
                        wire:model.blur="edit_content"
                        wire:key="edit-comment-{{ $comment->id }}"
                        class="w-full min-h-[60px] p-2 text-sm text-white bg-gray-950 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-600 resize-y transition"
                        ></textarea>
                        @error('editContent') <span class="text-xs text-red-500 block">{{ $message }}</span> @enderror
                        <div class="flex gap-2 justify-end">
                            <button type="button" wire:click="cancelEdit" class="px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition">Cancel</button>
                            <button type="submit" class="px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-500 transition">Save</button>
                        </div>
                    </form>
                @else
                    <p class="text-gray-200 text-sm whitespace-pre-line">{{ $comment->content }}</p>

                    <div class="mt-2 flex justify-between items-center border-t border-gray-700/50 pt-2">
                        <div class="flex gap-3">
                            @if($comment->user_id === auth()->id())
                                <button wire:click="startEdit({{ $comment->id }})" class="text-xs text-gray-400 hover:text-blue-400 transition flex items-center gap-1">
                                    <i class="bi bi-pencil"></i> Edit
                                </button>
                            @endif
                            @if($comment->user_id === auth()->id() || auth()->user()?->is_admin)
                                <button wire:click="delete({{ $comment->id }})" wire:confirm="Are you sure you want to delete this comment?" class="text-xs text-gray-400 hover:text-red-400 transition flex items-center gap-1">
                                    <i class="bi bi-trash"></i> Delete
                                </button>
                            @endif
                        </div>
                        <button wire:click="setReplyTo({{ $comment->id }})" class="text-xs text-gray-400 hover:text-emerald-400 transition flex items-center gap-1">
                            <i class="bi bi-reply"></i> Reply
                        </button>
                    </div>
                @endif

                @if($comment->replies->count() > 0)
                    <div class="mt-3 ml-6 pl-4 border-l border-gray-700 space-y-3">
                        @foreach($comment->replies as $reply)
                            <div class="p-3 bg-gray-900 bg-opacity-40 border border-gray-800 rounded-md">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="font-medium text-blue-400 text-xs">{{ $reply->user->name }}</span>
                                    <span class="text-[10px] text-gray-500">{{ $reply->updated_at->diffForHumans() }}</span>
                                </div>

                                @if($editing_comment_id === $reply->id)
                                    <form wire:submit.prevent="edit" class="space-y-2">
                                        <textarea wire:model="editContent" class="w-full min-h-[60px] p-2 text-xs text-white bg-gray-950 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-600 resize-y transition"></textarea>
                                        @error('editContent') <span class="text-xs text-red-500 block">{{ $message }}</span> @enderror
                                        <div class="flex gap-2 justify-end">
                                            <button type="button" wire:click="cancelEdit" class="px-2 py-1 bg-gray-700 text-white text-[10px] rounded hover:bg-gray-600 transition">Cancel</button>
                                            <button type="submit" class="px-2 py-1 bg-emerald-600 text-white text-[10px] rounded hover:bg-emerald-500 transition">Save</button>
                                        </div>
                                    </form>
                                @else
                                    <p class="text-gray-300 text-xs whitespace-pre-line">{{ $reply->content }}</p>

                                    @if($reply->user_id === auth()->id() || auth()->user()?->is_admin)
                                        <div class="mt-2 flex gap-3 justify-end border-t border-gray-800/50 pt-1">
                                            @if($reply->user_id === auth()->id())
                                                <button wire:click="startEdit({{ $reply->id }})" class="text-[10px] text-gray-500 hover:text-blue-400 transition flex items-center gap-0.5">
                                                    <i class="bi bi-pencil"></i> Edit
                                                </button>
                                            @endif
                                            <button wire:click="delete({{ $reply->id }})" wire:confirm="Are you sure you want to delete this reply?" class="text-[10px] text-gray-500 hover:text-red-400 transition flex items-center gap-0.5">
                                                <i class="bi bi-trash"></i> Delete
                                            </button>
                                        </div>
                                    @endif
                                @endif
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>
        @empty
            <p class="text-gray-500 text-sm text-center py-4">No comments yet. Be the first to leave one!</p>
        @endforelse
    </div>

    <div class="border-t border-gray-800 pt-4">
        @if($parent_id)
            <div class="flex justify-between items-center mb-2 px-3 py-1 bg-emerald-950 bg-opacity-30 border border-emerald-900 rounded text-xs text-emerald-400">
                <span>You are replying to a comment</span>
                <button wire:click="cancelReply" class="hover:text-red-400"><i class="bi bi-x-circle"></i></button>
            </div>
        @endif

        <form wire:submit.prevent="add" class="space-y-3">
            <div>
                <textarea
                    wire:model.blur="content"
                    placeholder="{{ $parent_id ? 'Write a reply...' : 'Leave your comment...' }}"
                    class="w-full min-h-[80px] p-3 text-sm text-white bg-gray-950 border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-600 resize-y transition"
                ></textarea>
                @error('content') <span class="text-xs text-red-500 mt-1 block">{{ $message }}</span> @enderror
            </div>

            <div class="flex justify-end">
                <button type="submit" class="px-4 py-2 bg-emerald-600 text-white font-medium text-sm rounded-lg hover:bg-emerald-500 transition shadow-md shadow-emerald-900/20">
                    <i class="bi bi-send-fill text-xs mr-1"></i> Send
                </button>
            </div>
        </form>
    </div>
</div>

