<div class="space-x-2 mt-2 mb-1" id="velocity-color-counter-divider">
    @include('fractals.partials.velocity-color')
    <div class="mt-4 mb-4 flex">
        <span class="input-description bg-gray rounded" id="counter-value" title="counter">3</span>
        <input type="range" step="1" max="8" min="3" value="3" id="counter" class="flex-1 py-2 mx-2" />
    </div>
    <div class="mt-2 mb-3 flex">
        <span class="input-description bg-gray rounded" id="divider-value" title="divider">0.5</span>
        <input type="range" step="0.01" max="0.95" min="0.1" value="0.5" id="divider" class="flex-1 py-2 mx-2" />
    </div>
</div>
