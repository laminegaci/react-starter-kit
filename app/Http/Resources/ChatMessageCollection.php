<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ChatMessageCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request)
    {
        return $this->collection->map(function ($chatMessage) {
            return [
                'id'          => $chatMessage->id,
                'sender_id'   => $chatMessage->sender_id,
                'receiver_id' => $chatMessage->receiver_id,
                'message'     => $chatMessage->message,
                'created_at' => $chatMessage->created_at,
                'updated_at' => $chatMessage->updated_at,
                'from_me'     => $chatMessage->sender_id === auth()->id(),
            ];
        })->all();
    }
}
