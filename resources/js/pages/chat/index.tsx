import { Head, usePage, router } from "@inertiajs/react";
import { Profile, type BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import { t } from "i18next";
import { useState, useEffect, useRef } from "react";
import { Send, UserCircle2, Circle, Menu, Router } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import echo from "@/echo";
import axios from "axios";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Chat", href: "/chat" },
];

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  from_me: boolean;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  profile?: Profile;
  online?: boolean;
}

interface PageProps {
  users: { data: User[] };
  messages: { data: Message[] };
  activeUserId?: number;
  auth: { user: User };
  [key: string]: unknown;
}

export default function Chat() {
  const { users, messages, activeUserId, auth } = usePage<PageProps>().props;

  const [activeUser, setActiveUser] = useState<User | null>(
    users.data.find((u) => u.id === activeUserId) ?? null
  );

  const [chatMessages, setChatMessages] = useState<Message[]>(messages.data);

  const [newMessage, setNewMessage] = useState("");

  // Ref pour scroll auto
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll auto en bas à chaque update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Mettre à jour quand Inertia renvoie de nouveaux messages
  useEffect(() => {
    setChatMessages(messages.data);
  }, [messages]);

  useEffect(() => {
    if (!echo || !auth?.user) return;

    const subscription = echo.private(`chat.${auth.user.id}`)
      .listen("MessageSent", (event: any) => {
        // Vérifie que c’est le bon correspondant
        if (event.sender_id === activeUser?.id) {
          setChatMessages((prev) => [...prev, event]);
        }
      });

    return () => {
      subscription.stopListening("MessageSent");
    };
  }, [activeUser?.id, auth?.user?.id]);


  // Changer d’utilisateur
  const handleUserClick = (user: User) => {
    setActiveUser(user);
    router.get(route("chat.messages", user.id), {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  // Envoyer message (simulation — à connecter avec backend)
  const handleSend = async () => {
    if (!newMessage.trim() || !activeUser) return;

    // message temporaire (optimistic update)
    const tempId = Date.now();
    const optimisticMessage = {
      id: tempId,
      sender_id: auth.user.id,
      receiver_id: activeUser.id,
      message: newMessage,
      from_me: true,
      created_at: new Date().toISOString(),
    };

    // 1. Update UI immédiatement
    setChatMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      // 2. Envoi au backend
      const response = await axios.post("/chat/messages", {
        receiver_id: activeUser.id,
        message: optimisticMessage.message,
      });

      // Optionnel : remplacer le message temporaire par celui du backend
      if (response.data?.id) {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, id: response.data.id } : msg
          )
        );
      }
    } catch (error) {
      console.error("Erreur envoi message :", error);

      // 3. Rollback → supprimer le message temporaire
      setChatMessages((prev) => prev.filter((msg) => msg.id !== tempId));

      // Optionnel : afficher un toast
      // toast.error("Échec de l’envoi du message");
    }
  };


  const UsersList = (
    <div className="w-64 h-full bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-700 overflow-y-auto">
      <h3 className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">
        {t("Users")}
      </h3>
      <ul>
        {users.data.map((user) => (
          <li
            key={user.id}
            onClick={() => handleUserClick(user)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
              activeUser?.id === user.id
                ? "bg-gray-200 dark:bg-gray-700"
                : ""
            }`}
          >
            <UserCircle2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {user.profile?.full_name}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Circle
                  className={`w-2 h-2 ${
                    user.online ? "text-green-500" : "text-gray-400"
                  }`}
                  fill={user.online ? "green" : "gray"}
                />
                {user.online ? t("Online") : t("Offline")}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t("Chat")} />
      <div className="px-4 py-6 h-[90vh] flex flex-col">
        <Heading
          title={t("Chat")}
          description={t("Chat in real time with your contacts")}
        />

        {/* Layout principal */}
        <div className="flex-1 mt-4 flex bg-white dark:bg-gray-950 rounded-2xl shadow overflow-hidden">
          {/* Liste utilisateurs → visible seulement en desktop */}
          <div className="hidden md:block">{UsersList}</div>

          {/* Zone de discussion */}
          <div className="flex flex-col flex-1">
            {/* En-tête conversation */}
            <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center gap-3 bg-gray-50 dark:bg-gray-900">
              {/* Bouton menu mobile */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0">
                    {UsersList}
                  </SheetContent>
                </Sheet>
              </div>

              <UserCircle2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {activeUser?.profile?.full_name ?? "Sélectionnez un utilisateur"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activeUser?.online ? t("Online") : t("Offline")}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${
                    msg.from_me ? "justify-end" : "justify-start"
                  }`}
                >
                  {!msg.from_me && (
                    <UserCircle2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  )}
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl shadow ${
                      msg.from_me
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border dark:border-gray-700 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {activeUser && (
              <div className="p-3 border-t dark:border-gray-700 flex gap-2 bg-gray-50 dark:bg-gray-900">
                <Input
                  placeholder={t("Type a message...")}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
                <Button onClick={handleSend} className="flex items-center gap-1">
                  <Send className="w-4 h-4" />
                  {t("Send")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
