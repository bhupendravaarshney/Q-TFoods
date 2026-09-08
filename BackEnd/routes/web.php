<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json(['service' => 'Q & T FOODS ERP + CRM Backend']));
