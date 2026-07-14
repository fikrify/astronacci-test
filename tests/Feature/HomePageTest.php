<?php

use Inertia\Testing\AssertableInertia;

it('renders the voucher page', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('index'));
});
