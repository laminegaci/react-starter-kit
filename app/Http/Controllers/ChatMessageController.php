<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatMessageCollection;
use App\Http\Resources\UserCollection;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ChatMessage;
use Illuminate\Http\Request as FormRequest;

class ChatMessageController extends Controller
{
    public function index(): Response
    {
        $authId = auth()->id();
        $userId=1;
        
        return Inertia::render('chat/index', [
            'users' => new UserCollection(
                User::with('profile')->whereNot('id', auth()->id())->get()
            ),
            'messages' => new ChatMessageCollection((
                ChatMessage::where(function ($q) use ($authId, $userId) {
                        $q->where('sender_id', $authId)
                        ->where('receiver_id', $userId);
                    })->orWhere(function ($q) use ($authId, $userId) {
                        $q->where('sender_id', $userId)
                        ->where('receiver_id', $authId);
                    })
                    ->with(['sender.profile', 'receiver.profile'])
                    ->orderBy('created_at', 'desc')
                    ->get()
            )) ,
        ]);
    }

    public function store(FormRequest $request): Void
    {
        $validatedData = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        ChatMessage::create([
            'sender_id' => auth()->id(),
            'receiver_id' => request('receiver_id'),
            'message' => request('message'),
        ]);
    }
}
