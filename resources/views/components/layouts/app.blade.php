<x-layouts.app.sidebar :title="$title ?? null">
    <flux:main>
        @include('partials.header')
        {{ $slot }}
        @include('partials.footer')
    </flux:main>
</x-layouts.app.sidebar>
