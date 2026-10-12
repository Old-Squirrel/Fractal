@php
$controlElements = json_decode($script->control_elements);
$presets = $controlElements->params ?? [];
@endphp

<div class="space-x-2 mt-2 mb-1" id="velocity-color">
    @include('fractals.partials.velocity-color')
    <div class="mt-4 mb-4">
        <label for="symetric-icons-params" class="block text-xs text-gray-400 mb-1">Choose Preset:</label>
        <select name="symetric-icons-params" id="symetric-icons-params"
            class="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 text-sm cursor-pointer">
            @foreach ($presets as $key => $preset)
            <option value="{{ json_encode($preset) }}">
                {{ $preset->title }}
            </option>
            @endforeach
        </select>
    </div>
</div>
