<header id="header">
    <nav class="navbar navbar-expand-xl navbar-dark">
        <div class="container">

            <a href="{{'/'}}" id="app-logo">Fractals</a>

            <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarContent"
                aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse " id="navbarContent">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a href="#">Fractal-1</a>
                    </li>
                    <li class="nav-item">
                        <a href="#">Fractal-2</a>
                    </li>
                    <li class="nav-item">
                        <a href="#">Fractal-3</a>
                    </li>
                    <li class="nav-item">
                        <a href="#">Fractal-4</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle text-warning fst-italic" href="#" id="navbarDropdown"
                            role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Administration
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li ><a href="{{url('fractals')}}">Scripts list</a></li>
                            <li>
                                <hr class="dropdown-divider  bg-light">
                            </li>
                            <li><a href="{{url('fractals/create')}}">Add new script</a></li>
                            <li>
                                <hr class="dropdown-divider bg-light">
                            </li>
                            <li><a href="#">itworks!</a></li>
                        </ul>
                    </li>
                </ul>
            
                <form class="my-auto" id="header_search-form">
                    <input  type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
           
                @if (Route::has('login'))
                <div class="navbar-nav">
                    @auth
                    <a href="{{ url('/') }}">Home</a>
                    @else
                    <a href="{{ route('login') }}">Login</a>
                    <a href="{{ route('register') }}">Register</a>
                    @endauth
                </div>
                @endif
            </div>

        </div>
    </nav>
</header>
