"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Send, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import ArrowLeftBack from "@/components/gekaixing/ArrowLeftBack";
import { useSearchParams } from "next/navigation";
import { User } from "@supabase/supabase-js";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  unreadCount: number;
  participantId?: string;
  lastMessage?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  conversationId: string;
  content: string;
  createdAt: string;
  isMe: boolean;
}

interface ConversationResponse {
  id: string;
  name: string;
  avatar?: string;
  unreadCount: number;
  participantId?: string;
  lastMessage?: string;
}

interface RealtimeMessage {
  id: string;
  senderId: string;
  conversationId: string;
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const userIdFromQuery = searchParams.get("userId");
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contactsScrollRef = useRef<HTMLDivElement>(null);
  const supabase = useRef(createClient()).current;

  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, [supabase]);

  const createConversation = useCallback(async (targetUserId: string) => {
    try {
      const response = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      
      const result = await response.json();
      if (result.success && result.data) {
        const newContact: Contact = {
          id: result.data.id,
          name: result.data.name,
          avatar: result.data.avatar,
          isOnline: false,
          unreadCount: 0,
          participantId: result.data.participantId,
        };
        setContacts((prev) => [newContact, ...prev]);
        setSelectedContactId(result.data.id);
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/chat/conversations");
      const result = await response.json();
      
      if (result.success && result.data) {
        const formattedContacts = (result.data as ConversationResponse[]).map((conv) => ({
          id: conv.id,
          name: conv.name,
          avatar: conv.avatar,
          isOnline: false,
          unreadCount: conv.unreadCount,
          participantId: conv.participantId,
          lastMessage: conv.lastMessage,
        }));
        setContacts(formattedContacts);
        
        if (userIdFromQuery) {
          const existingConv = formattedContacts.find(
            (c) => c.participantId === userIdFromQuery
          );
          if (existingConv) {
            setSelectedContactId(existingConv.id);
          } else {
            await createConversation(userIdFromQuery);
          }
        } else if (formattedContacts.length > 0 && !selectedContactId) {
          setSelectedContactId(formattedContacts[0].id);
        }
      } else if (userIdFromQuery) {
        await createConversation(userIdFromQuery);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  }, [userIdFromQuery, selectedContactId, createConversation]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const url = `/api/chat/messages?conversationId=${conversationId}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success && result.data) {
        setMessages(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }, []);

  useEffect(() => {
    fetchConversations().then(() => setIsLoading(false));
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedContactId) {
      fetchMessages(selectedContactId);
    }
  }, [selectedContactId, fetchMessages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const channel = supabase
      .channel(`chat-room-${selectedContactId || "global"}`)
      .on(
        "broadcast",
        { event: "new-message" },
        (payload) => {
          const newMessage = payload.payload as RealtimeMessage;

          if (newMessage.conversationId === selectedContactId) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMessage.id)) {
                return prev;
              }

              const formattedMessage: Message = {
                id: newMessage.id,
                senderId: newMessage.senderId,
                conversationId: newMessage.conversationId,
                content: newMessage.content,
                createdAt: newMessage.createdAt,
                isMe: newMessage.senderId === currentUser.id,
              };

              return [...prev, formattedMessage];
            });
          } else {
            setContacts((prev) =>
              prev.map((c) =>
                c.id === newMessage.conversationId
                  ? { ...c, unreadCount: c.unreadCount + 1, lastMessage: newMessage.content }
                  : c
              )
            );
          }
        }
      )
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") {
          console.error("Failed to subscribe to chat messages:", status);
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, selectedContactId, currentUser?.id]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedContactId) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      senderId: currentUser?.id || "",
      conversationId: selectedContactId,
      content: inputMessage.trim(),
      createdAt: new Date().toISOString(),
      isMe: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInputMessage("");

    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedContactId,
          content: tempMessage.content,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const savedMessage = result.data as Message;
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? savedMessage : m))
        );

        setContacts((prev) =>
          prev.map((c) =>
            c.id === selectedContactId
              ? { ...c, lastMessage: tempMessage.content }
              : c
          )
        );

        await supabase
          .channel(`chat-room-${selectedContactId}`)
          .send({
            type: "broadcast",
            event: "new-message",
            payload: {
              id: savedMessage.id,
              senderId: savedMessage.senderId,
              conversationId: savedMessage.conversationId,
              content: savedMessage.content,
              createdAt: savedMessage.createdAt,
            },
          });
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollContacts = (direction: "left" | "right") => {
    if (contactsScrollRef.current) {
      const scrollAmount = 200;
      contactsScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId);
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, unreadCount: 0 } : c))
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ArrowLeftBack name="聊天" />
      <div className="border-b bg-muted/20 relative">
        <div className="flex items-center px-2 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 size-8"
            onClick={() => scrollContacts("left")}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div
            ref={contactsScrollRef}
            className="flex-1 overflow-x-auto scrollbar-hide mx-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex gap-3 px-1">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleContactSelect(contact.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all shrink-0 min-w-[64px] relative",
                    selectedContactId === contact.id
                      ? "bg-primary/10 ring-2 ring-primary"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="relative">
                    <Avatar className="size-12">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {contact.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-green-500 rounded-full border-2 border-background" />
                    )}
                    {contact.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                        {contact.unreadCount > 99 ? "99+" : contact.unreadCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs truncate max-w-[60px]",
                      selectedContactId === contact.id
                        ? "font-medium text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {contact.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 size-8"
            onClick={() => scrollContacts("right")}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {selectedContact ? (
          <>
            <div className="h-14 border-b flex items-center px-4 gap-3 bg-background shrink-0">
              <Avatar className="size-9">
                <AvatarImage src={selectedContact.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {selectedContact.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-sm truncate">
                  {selectedContact.name}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {selectedContact.isOnline ? "在线" : "离线"}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  开始与 {selectedContact.name} 聊天
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.isMe ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Avatar className="size-7 shrink-0">
                      <AvatarImage
                        src={message.isMe ? undefined : (message.senderAvatar || selectedContact.avatar)}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                        {message.isMe
                          ? "我"
                          : (message.senderName || selectedContact.name).slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col max-w-[75%]">
                      <div
                        className={cn(
                          "px-3 py-2 rounded-2xl text-sm",
                          message.isMe
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        )}
                      >
                        {message.content}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] text-muted-foreground mt-1",
                          message.isMe ? "text-right" : "text-left"
                        )}
                      >
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t bg-background shrink-0">
              <div className="flex gap-2">
                <Input
                  placeholder={`给 ${selectedContact.name} 发消息...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  size="icon"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            {contacts.length === 0 ? "暂无聊天，去关注其他用户开始聊天吧" : "选择一个联系人开始聊天"}
          </div>
        )}
      </div>
    </div>
  );
}
