<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Enums\UserGenderEnum;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use App\Observers\ProfileObserver;
use App\Http\Resources\MediaAvatarResource;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

#[ObservedBy([ProfileObserver::class])]
class Profile extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia, LogsActivity;

    public const MEDIA_COLLECTION_NAME = 'profile-avatar';
    public const MEDIA_DISK_NAME = 'profile-avatar';

    // public const ATTACHMENT_COLLECTION_NAME = 'profile-attachment';
    // public const ATTACHMENT_DISK_NAME = 'profile-attachment';
    // public const ATTACHMENT_KEEP_LATEST = 3;

    protected $fillable = [
        'first_name',
        'last_name',
        'full_name',
        'gender',
        'phone_number',
        'address',
        'zip_code',
        'description',
        'born_at',
        'user_id'
    ];

    protected $casts = [
        'gender' => UserGenderEnum::class,
        'born_at' => 'datetime'
    ];

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    |
    */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /*
    |--------------------------------------------------------------------------
    | Methods
    |--------------------------------------------------------------------------
    |
    */

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection(self::MEDIA_COLLECTION_NAME)
            ->singleFile()
            ->useDisk(self::MEDIA_DISK_NAME)
            ->useFallbackUrl(asset('images/avatar-profile-man.png'));
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->crop('crop-center', '180', '180')
            ->performOnCollections(self::MEDIA_COLLECTION_NAME)
            ->quality(70);

        $this->addMediaConversion('square')
            ->crop('crop-center', '250', '250')
            ->performOnCollections(self::MEDIA_COLLECTION_NAME)
            ->quality(70);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['first_name', 'last_name'])
            ->useLogName('profile')
            ->setDescriptionForEvent(fn(string $eventName) => "Profile has been {$eventName}")
            ->dontSubmitEmptyLogs();
    }

    /*
	|--------------------------------------------------------------------------
	| Scopes
	|--------------------------------------------------------------------------
	|
	*/

    public function scopeBirthdayBetween($query, $start, $end)
    {
        return $query->whereDate('profiles.born_at', '>=', $start)
            ->whereDate('profiles.born_at', '<=', $end);
    }

    /*
	|--------------------------------------------------------------------------
	| Getters and Setters
	|--------------------------------------------------------------------------
	|
    */

    public function firstName(): Attribute
    {
        return Attribute::set(fn($value) => ucwords($value));
    }

    public function lastName(): Attribute
    {
        return Attribute::set(fn($value) => ucwords($value));
    }

    /*
	|--------------------------------------------------------------------------
	| Mutators
	|--------------------------------------------------------------------------
	|
	*/

    public function avatar(): Attribute
    {
        $media = $this->getFirstMedia(self::MEDIA_COLLECTION_NAME);

        $avatar = ! $media
            ? [
                'original' => $this->getFallbackMediaUrl(self::MEDIA_COLLECTION_NAME),
                'thumb'    => $this->getFallbackMediaUrl(self::MEDIA_COLLECTION_NAME),
                'square'   => $this->getFallbackMediaUrl(self::MEDIA_COLLECTION_NAME),
            ]
            : new MediaAvatarResource($media);

        return Attribute::get(fn () => $avatar);
    }

    // public function attachments(): Attribute
    // {
    //     $attachmentsMedia = $this->getMedia(self::ATTACHMENT_COLLECTION_NAME);

    //     $attachments = [];
    //     foreach ($attachmentsMedia as $attachment) {
    //         $attachments[] = [
    //             'id' => $attachment->id ?? null,
    //             'name' => $attachment->getCustomProperty('name'),
    //             'file' => [
    //                 'id' => $attachment->id ?? null,
    //                 'url' => $attachment->getUrl(),
    //                 'size' => $attachment->size ?? 0
    //             ],
    //         ];
    //     }

    //     return Attribute::get(fn() => $attachments);
    // }

    // public function civility(): Attribute
    // {
    //     return Attribute::get(fn() => $this->gender->description());
    // }
}
