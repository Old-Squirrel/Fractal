<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name') }}</title>

    <!-- Fonts -->
   
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css">
    <!-- Styles -->

    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
   


</head>
<body>
@include("layouts.header")

<div id="content">
@yield('content')
</div>
@include("layouts.footer")

<script src="{{ asset('/js/app.js') }} " defer></script>


</body>
</html>
