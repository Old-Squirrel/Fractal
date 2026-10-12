<div class="w-full flex flex-wrap justify-around border-t border-cyan-600 mt-4">
    <div class="sm:w-1/2 md:w-1/4 lg:w-1/4 p-2 mt-4">
        <a href="/"><span class="text-cyan-600 capitalize">
                <i class="bi bi-snow2 mx-2"></i>app fractal</span></a>
    </div>

    <div class="sm:w-1/2 md:w-1/4 lg:w-1/4 p-2 mt-4">
        <span class="text-cyan-600">
            <i class="bi bi-info-square mx-2"></i> App Version: {{ app('app.version') ?? '' }}</span>
    </div>

    <div class="sm:w-1/2 md:w-1/4 lg:w-1/4 p-2 mt-4">
        <span class="text-cyan-600">
            <i class="bi bi-person-workspace mx-2"></i> Author: {{ app('app.author') ?? '' }}</span>
    </div>

    <div class="sm:w-1/2 md:w-1/4 lg:w-1/4 p-2 mt-4">
        <span class="text-cyan-600">
            <i class="bi bi-calendar4-event mx-2"></i> Date: {{ app('app.date') ?? '' }}</span>
    </div>
</div>
