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

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

const mockContacts: Contact[] = [
  { id: "1", name: "张三", isOnline: true },
  { id: "2", name: "李四", isOnline: false },
  { id: "3", name: "王五", isOnline: true },
  { id: "4", name: "赵六", isOnline: true },
  { id: "5", name: "陈七", isOnline: false },
  { id: "6", name: "刘八", isOnline: true },
  { id: "7", name: "周九", isOnline: false },
  { id: "8", name: "吴十", isOnline: true },
];

const initialMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      senderId: "1",
      content: "你好！最近怎么样？",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isMe: false,
    },
    {
      id: "m2",
      senderId: "me",
      content: "还不错，你呢？",
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      isMe: true,
    },
  ],
  "2": [
    {
      id: "m1",
      senderId: "2",
      content: "在吗？",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isMe: false,
    },
  ],
};

export default function ChatPage() {
  const searchParams = useSearchParams();
  const userIdFromQuery = searchParams.get("userId");
  
  const [selectedContactId, setSelectedContactId] = useState<string>(userIdFromQuery || "1");
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contactsScrollRef = useRef<HTMLDivElement>(null);
  const supabase = useRef(createClient()).current;

  const allContacts = React.useMemo(() => {
    if (userIdFromQuery && !mockContacts.find(c => c.id === userIdFromQuery)) {
      return [...mockContacts, { 
        id: userIdFromQuery, 
        name: `用户 ${userIdFromQuery.slice(0, 8)}...`, 
        isOnline: false 
      }];
    }
    return mockContacts;
  }, [userIdFromQuery]);

  const selectedContact = allContacts.find((c) => c.id === selectedContactId);
  const currentMessages = messages[selectedContactId] || [];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, scrollToBottom]);

  // Subscribe to Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel("chat-messages")
      .on(
        "broadcast",
        { event: "new-message" },
        (payload) => {
          const newMessage = payload.payload as Message;
          
          // Only add message if it's for the current conversation
          if (newMessage.senderId === selectedContactId || newMessage.isMe) {
            setMessages((prev) => {
              const contactId = newMessage.isMe ? selectedContactId : newMessage.senderId;
              const existingMessages = prev[contactId] || [];
              
              // Prevent duplicate messages
              if (existingMessages.some((m) => m.id === newMessage.id)) {
                return prev;
              }
              
              return {
                ...prev,
                [contactId]: [...existingMessages, newMessage],
              };
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, selectedContactId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedContactId) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      isMe: true,
    };

    // Update local state
    setMessages((prev) => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage],
    }));

    // Broadcast via Supabase Realtime
    await supabase.channel("chat-messages").send({
      type: "broadcast",
      event: "new-message",
      payload: newMessage,
    });

    setInputMessage("");
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

  return (
    <div className="flex flex-col h-full bg-background">
      <ArrowLeftBack name='聊天'></ArrowLeftBack>
      {/* Horizontal Contacts List */}
      <div className="border-b bg-muted/20 relative">
        <div className="flex items-center px-2 py-3">
          {/* Left Scroll Button */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 size-8"
            onClick={() => scrollContacts("left")}
          >
            <ChevronLeft className="size-4" />
          </Button>

          {/* Contacts Scroll Container */}
          <div
            ref={contactsScrollRef}
            className="flex-1 overflow-x-auto scrollbar-hide mx-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex gap-3 px-1">
              {allContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all shrink-0 min-w-[64px]",
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

          {/* Right Scroll Button */}
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

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {selectedContact ? (
          <>
            {/* Header */}
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  开始与 {selectedContact.name} 聊天
                </div>
              ) : (
                currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.isMe ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Avatar className="size-7 shrink-0">
                      <AvatarImage
                        src={message.isMe ? undefined : selectedContact.avatar}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                        {message.isMe
                          ? "我"
                          : selectedContact.name.slice(0, 2)}
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
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
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
            选择一个联系人开始聊天
          </div>
        )}
      </div>
    </div>
  );
}
