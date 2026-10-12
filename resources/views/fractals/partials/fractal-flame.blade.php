@php
$controlElements = json_decode($script->control_elements);
$presets = $controlElements->params ?? [];
@endphp

<div class="space-y-4 mt-3 mb-3" id="fractal-flame-container">
    <div class="flex flex-col">
        <label for="fractal-flame-params" class="block text-xs text-gray-400 mb-1">Choose Variation:</label>
        <select name="fractal-flame-params" id="fractal-flame-params"
            class="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 text-sm cursor-pointer">
            @foreach ($presets as $key => $preset)
            <option value="{{ json_encode($preset) }}">
                {{ $preset->title }}
            </option>
            @endforeach
        </select>
    </div>

    <div class="flex flex-col">
        <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>Gamma (Contrast)</span>
            <span id="gamma-value">1.5</span>
        </div>
        <input type="range" step="0.1" max="4.0" min="0.5" value="1.5" id="set-gamma" class="w-full py-1" />
    </div>

    @include('fractals.partials.velocity-color', ['script' => $script])
</div>
