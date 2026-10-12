<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <!-- Main Modal Box -->
    <div class="w-full md:min-w-[50%] max-w-4xl bg-gray-900 border border-gray-800 rounded-xl shadow-2xl text-gray-100 flex flex-col max-h-[85vh] animate-fade-in"
         @if($isImporting) wire:poll.2s @endif>

        <!-- HEADER -->
        <div class="flex items-center justify-between p-4 border-b border-gray-800">
            <div class="flex items-center gap-3">
                <h3 class="text-xl font-bold text-gray-100 tracking-wide">Import Logs: {{ ucfirst($modelAlias) }}</h3>

                @if($isImporting)
                    <span class="flex items-center gap-1.5 text-xs text-blue-400 font-semibold bg-blue-950/50 px-2.5 py-1 rounded-full border border-blue-900 animate-pulse">
                        <span class="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
                        Processing in queue...
                    </span>
                @elseif($isFinished)
                    <span class="text-xs text-green-400 font-semibold bg-green-950/50 px-2.5 py-1 rounded-full border border-green-900 flex items-center gap-1">
                        <i class="bi bi-check-circle-fill"></i> Completed Successfully
                    </span>
                @else
                    <span class="text-xs text-gray-400 font-semibold bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
                        <i class="bi bi-pause-circle-fill"></i> Idle
                    </span>
                @endif
            </div>

            <!-- Close Action -->
            <button wire:click="$set('isImporting', false)"
                    onclick="this.closest('.fixed').remove()"
                    class="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center">
                <i class="bi bi-x-lg text-lg"></i>
            </button>
        </div>

        <!-- BODY -->
        <div class="p-6 overflow-y-auto flex-1">

            <!-- FINISHED STATUS BANNER -->
            @if($isFinished)
                <div class="mb-6 p-4 bg-green-950/20 border border-green-900/60 rounded-lg flex items-center gap-3 animate-fade-in">
                    <div class="text-green-400 text-2xl flex items-center justify-center bg-green-950/40 w-10 h-10 rounded-full border border-green-900">
                        <i class="bi bi-trophy-fill"></i>
                    </div>
                    <div>
                        <h5 class="text-green-400 font-bold text-sm">Queue Execution Finished!</h5>
                        <p class="text-xs text-gray-400 mt-0.5">All chunks have been successfully processed by the Docker container background worker.</p>
                    </div>
                </div>
            @endif

            <h4 class="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">Excel Validation Errors:</h4>

            @if($failures->isEmpty())
                <div class="flex flex-col items-center justify-center py-12 text-center">
                    <div class="p-3 bg-green-950/30 text-green-400 rounded-full border border-green-900/50 mb-3 flex items-center justify-center w-14 h-14">
                        <i class="bi bi-check2-square text-3xl"></i>
                    </div>
                    <p class="text-green-400 font-medium text-base">No errors detected in the file so far.</p>
                    <p class="text-xs text-gray-500 mt-1">Everything looks safe or queue is preparing chunks.</p>
                </div>
            @else
                <div class="overflow-hidden border border-gray-800 rounded-lg bg-gray-950 shadow-inner">
                    <table class="min-w-full divide-y divide-gray-800 text-sm">
                        <thead class="bg-gray-800/80 text-gray-300 font-semibold">
                            <tr>
                                <th class="p-3 text-left text-red-400 w-24">Row</th>
                                <th class="p-3 text-left w-40">Column</th>
                                <th class="p-3 text-left text-red-400">Error Description</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800">
                            @foreach($failures as $failure)
                                <tr class="bg-red-950/10 hover:bg-red-950/20 transition-colors">
                                    <td class="p-3 font-bold text-red-400 whitespace-nowrap">
                                        <i class="bi bi-exclamation-triangle-fill mr-1.5 text-xs"></i># {{ $failure->row }}
                                    </td>
                                    <td class="p-3 font-mono text-gray-400 text-xs whitespace-nowrap">{{ $failure->attribute }}</td>
                                    <td class="p-3 text-red-300/90 leading-relaxed font-medium">{{ $failure->error_message }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>

        <!-- FOOTER -->
        <div class="p-4 border-t border-gray-800 bg-gray-950/40 rounded-b-xl flex items-center justify-between text-xs text-gray-500">
            <span>Database Table: <span class="font-mono text-gray-400">import_failures</span></span>
            <span class="flex items-center gap-1">
                @if($isImporting)
                    <i class="bi bi-lightning-charge-fill text-yellow-500 animate-pulse"></i> Real-time polling active
                @else
                    <i class="bi bi-shield-fill-check text-green-500"></i> Monitoring stopped
                @endif
            </span>
        </div>
    </div>
</div>
