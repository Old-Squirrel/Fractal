<x-layouts.app>
    <div
        class="flex items-center justify-center w-full transition-opacity opacity-100 duration-750 lg:grow starting:opacity-0">
        <main class="w-full mb-3">
            @if(!empty($fractals))
            <div class="fractal-board mb-3">
                <div class="fractal-board_title-wrapper">
                    <h1 class="text-center">Scripts List</h1>
                </div>
                @foreach ($fractals as $script)
                <div class="fractal-board_card">
                    <div class="fractal-board_content">
                        <a href="/fractal-scripts/{{$script->slug}}" class="fractal-board_link">
                            {{$script->title}}<i class="bi bi-javascript mx-2"></i>
                        </a>
                        <div class="fractal-board_description">
                            {{$script->description}}
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
            @else
            <div class="fractal-painter">
                <div class="fractal-painter_header">
                    <h2 class="text-white capitalize text-center mb-4">
                        {{$script->title ?? ""}}
                    </h2>

                    <details class="w-full cursor-pointer group mb-6">
                        <summary
                            class="flex items-center justify-between px-4 py-2 text-gray-300 bg-gray-800 rounded hover:bg-gray-700 transition select-none">
                            <span>Description</span>
                            <i class="bi bi-chevron-down"></i>
                        </summary>
                        <div class="px-4 py-3 text-gray-300 bg-gray-800 bg-opacity-50 border-t border-gray-700 mt-px">
                            <p class="px-4">
                                <span class="px-4">
                                    {{ $script->description ?? "No description available" }}
                                </span>
                            </p>
                        </div>
                    </details>
                </div>

                <div class="fractal-painter_workspace">
                    <div class="fractal-painter_sidebar">
                        <div class="control-panel">
                            @include('fractals.partials.control-buttons')
                            @includeIf('fractals.partials.' . json_decode($script->control_elements)->partials,
                            ['script'=>$script])
                        </div>
                    </div>
                    @include('fractals.partials.canvas')
                </div>
                @auth
                <livewire:comments :model="$script" />
                @endauth
            </div>
            @endif
        </main>
    </div>
</x-layouts.app>
