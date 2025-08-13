<?php

namespace App\Observers;

use App\Models\User;
use App\Settings\GeneralSettings;

class UserObserver
{
    public function created(User $user): void
    {
        // if($user->isDirty(['email'])) {
        //     $settings = new GeneralSettings();
        //     User::withoutEvents(function() use($user, $settings) {
        //         $user->update([
        //             'validation_code' => $settings->master_code
        //         ]);
        //     });
        // }
    }
}
