<header
    x-data="{
        show: true,
        lastScrollY: 0,
        init() {
            window.addEventListener('scroll', () => {
                if (window.scrollY > this.lastScrollY && window.scrollY > 50) {
                    this.show = false;
                } else {
                    this.show = true;
                }
                this.lastScrollY = window.scrollY;
            });
        }
    }"
    :class="show ? 'smart-header__visible' : 'smart-header__hidden'"
    class="smart-header bg-white/70 dark:bg-[#1b1b18]/70 border-b border-black/5 dark:border-white/5 not-has-[nav]:hidden"
>
    @if (Route::has('login'))
    <nav class="smart-header_nav">
        <a href="{{ route('fractals') }}" class="smart-header_link">
            Fractals
        </a>
        @auth
        <a href="{{ url('/dashboard') }}" class="smart-header_link">
            Dashboard
        </a>
        @else
        <a href="{{ route('login') }}" class="smart-header_link">
            Log in
        </a>

        @if (Route::has('register'))
        <a href="{{ route('register') }}" class="smart-header_link">
            Register
        </a>
        @endif
        @endauth
    </nav>
    @endif
</header>

<div class="pt-20"></div>

