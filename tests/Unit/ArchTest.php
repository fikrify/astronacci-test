<?php

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Resources\Json\JsonResource;

arch('no debugging leftovers')
    ->expect(['dd', 'dump', 'ray', 'var_dump', 'print_r', 'die', 'exit'])
    ->not->toBeUsed();

arch('controllers')
    ->expect('App\Http\Controllers')
    ->toHaveSuffix('Controller')
    ->toExtend(Controller::class);

arch('form requests')
    ->expect('App\Http\Requests')
    ->toHaveSuffix('Request')
    ->toExtend(FormRequest::class);

arch('resources')
    ->expect('App\Http\Resources')
    ->toHaveSuffix('Resource')
    ->toExtend(JsonResource::class);

arch('models')
    ->expect('App\Models')
    ->toExtend(Model::class);

arch('exceptions')
    ->expect('App\Exceptions')
    ->toHaveSuffix('Exception')
    ->toExtend(Exception::class);

arch('services stay free of http concerns')
    ->expect('App\Services')
    ->toHaveSuffix('Service')
    ->not->toUse(['Illuminate\Http\Request', 'Illuminate\Http\Response']);

arch('strict types are enforced across the app')
    ->expect('App')
    ->toUseStrictEquality();

arch()->preset()->php();
