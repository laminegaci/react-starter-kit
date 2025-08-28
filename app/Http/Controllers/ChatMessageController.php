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
        $users = User::with('profile')
            ->whereNot('id', auth()->id())
            ->get();

        // premier utilisateur (si existe)
        $firstUser = $users->first();

        $messages = collect();
        if ($firstUser) {
            $messages = ChatMessage::where(function ($q) use ($firstUser) {
                    $q->where('sender_id', auth()->id())
                      ->where('receiver_id', $firstUser->id);
                })->orWhere(function ($q) use ($firstUser) {
                    $q->where('sender_id', $firstUser->id)
                      ->where('receiver_id', auth()->id());
                })
                ->orderBy('created_at', 'asc')
                ->get();
        }

        return Inertia::render('chat/index', [
            'users'    => new UserCollection($users),
            'messages' => new ChatMessageCollection($messages),
            'activeUserId' => $firstUser?->id,
        ]);
    }

    public function messages(User $user): Response
    {
        $authId = auth()->id();

        $messages = ChatMessage::where(function ($q) use ($authId, $user) {
                $q->where('sender_id', $authId)
                  ->where('receiver_id', $user->id);
            })->orWhere(function ($q) use ($authId, $user) {
                $q->where('sender_id', $user->id)
                  ->where('receiver_id', $authId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('chat/index', [
            'users'    => new UserCollection(
                User::with('profile')->whereNot('id', $authId)->get()
            ),
            'messages' => new ChatMessageCollection($messages),
            'activeUserId' => $user->id,
        ]);
    }

    public function send(FormRequest $request): Void
    {
        $validatedData = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        $chatMessage = ChatMessage::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $validatedData['receiver_id'],
            'message' => $validatedData['message'],
        ]);

        broadcast(new \App\Events\MessageSent($chatMessage));
    }
}
