<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | The React SPA lives in its own repository folder and is served from a
    | different origin than this API, so it needs CORS headers. List the
    | origins it is served from in FRONTEND_URL, comma separated for more
    | than one.
    |
    */

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(
        explode(',', (string) env('FRONTEND_URL', 'http://localhost:5173'))
    ),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
