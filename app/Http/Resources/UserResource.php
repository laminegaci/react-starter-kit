<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public static $wrap = null;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            // 'is_active' => $this->is_active,
            // 'notifications_count' => $this->notifications()->count(),
            // 'unread_notifications_count' => $this->unreadNotifications()->count(),
            'role' => $this->roles->first(),
            'full_name' => $this->profile->full_name,
            'profile' => $this->whenLoaded('profile', fn() => ProfileResource::make($this->profile)),
            // 'portfolios' => $this->whenLoaded('portfolios', fn() => PortfoliosResource::collection($this->portfolios)),
            // 'unread_messages_count' => $this->unreadMessagesCount() ?: 0,
        ];
    }
}
