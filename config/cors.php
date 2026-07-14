<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | The React frontend is served by Laravel itself through Inertia, so it
    | shares an origin with the API and needs no CORS headers. These settings
    | exist so the API can also be called from a frontend hosted elsewhere:
    | list its origin in FRONTEND_URL, comma separated for more than one.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(
        explode(',', (string) env('FRONTEND_URL', ''))
    ),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
