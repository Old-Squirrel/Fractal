<div class="space-x-2 mt-3 mb-3" id="mandelbrot-set-2d">
    <select id="mode-select"
        class="block w-full text-black rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        <option selected>select mode</option>
        <option value="2">z&sup2+c</option>
        <option value="3">z&sup3+c</option>
        <option value="5">z&#8309;+c</option>
    </select>

    <div class="mt-2 flex">
        <span class="input-description rounded-l-md">Scale</span>
        <input type="text" id="set-scale" class="input-text" />
    </div>

    <div class="mt-2 flex">
        <span class="input-description rounded-l-md">X</span>
        <input type="text" id="set-coord-x" class="input-text" />
    </div>

    <div class="mt-2 flex">
        <span class="input-description rounded-l-md">Y</span>
        <input type="text" id="set-coord-y" class="input-text" />
    </div>
</div>
