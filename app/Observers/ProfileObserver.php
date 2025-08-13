<?php

namespace App\Observers;

use App\Models\Profile;

class ProfileObserver
{
    public function created(Profile $profile): void
    {
        $this->onNameChanged($profile);
    }

    public function updated(Profile $profile): void
    {
        $this->onNameChanged($profile);
    }

    protected function onNameChanged(Profile $profile): void
    {
        if($profile->isDirty(['first_name', 'last_name'])) {
            Profile::withoutEvents(function() use($profile) {
                $profile->update([
                    'full_name' => $profile->first_name ? $profile->first_name . ' ' . $profile->last_name : null
                ]);
            });
        }
    }
}
