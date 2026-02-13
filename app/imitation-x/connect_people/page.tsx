"use client";

import { useState } from "react";
import { ArrowLeft, Search, UserPlus, UserCheck, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  isFollowing: boolean;
  isVerified?: boolean;
}

const mockUsers: UserProfile[] = [
  {
    id: "1",
    name: "科技日报",
    handle: "@techdaily",
    avatar: "",
    bio: "关注全球科技动态，分享最新科技资讯",
    isFollowing: false,
    isVerified: true,
  },
  {
    id: "2",
    name: "设计之美",
    handle: "@designhub",
    avatar: "",
    bio: "探索设计与艺术的无限可能",
    isFollowing: true,
    isVerified: false,
  },
  {
    id: "3",
    name: "编程狂人",
    handle: "@codegeek",
    avatar: "",
    bio: "Full-stack developer | Open source enthusiast",
    isFollowing: false,
    isVerified: true,
  },
  {
    id: "4",
    name: "美食探店",
    handle: "@foodie",
    avatar: "",
    bio: "吃遍天下美食，记录每一口感动",
    isFollowing: false,
    isVerified: false,
  },
  {
    id: "5",
    name: "摄影师小明",
    handle: "@photoxm",
    avatar: "",
    bio: "用镜头记录世界的美好瞬间",
    isFollowing: false,
    isVerified: true,
  },
];

type TabType = "recommended" | "followers" | "following";

export default function ConnectPeoplePage() {
  const [activeTab, setActiveTab] = useState<TabType>("recommended");
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFollow = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "recommended" as TabType, label: "推荐关注" },
    { id: "followers" as TabType, label: "关注者" },
    { id: "following" as TabType, label: "正在关注" },
  ];

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3">
          <Link
            href="/imitation-x"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">连接</h1>
            <p className="text-sm text-gray-500">@{users.length} 位用户</p>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 bg-gray-400 rounded-full hover:bg-gray-500 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-black"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredUsers.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">没有找到匹配的用户</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Link href={`/imitation-x/user/${user.id}`}>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gray-200 text-gray-600 font-medium">
                    {user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/imitation-x/user/${user.id}`}
                        className="font-bold text-sm hover:underline truncate"
                      >
                        {user.name}
                      </Link>
                      {user.isVerified && (
                        <svg
                          className="w-4 h-4 text-blue-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {user.handle}
                    </p>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(user.id);
                    }}
                    variant={user.isFollowing ? "outline" : "default"}
                    size="sm"
                    className={cn(
                      "rounded-full text-sm font-bold min-w-[80px] transition-all",
                      user.isFollowing
                        ? "border-gray-300 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
                        : "bg-black text-white hover:bg-black/90"
                    )}
                  >
                    {user.isFollowing ? (
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-4 h-4" />
                        已关注
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <UserPlus className="w-4 h-4" />
                        关注
                      </span>
                    )}
                  </Button>
                </div>

                <Link href={`/imitation-x/user/${user.id}`}>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    {user.bio}
                  </p>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredUsers.length > 0 && (
        <div className="py-4 text-center">
          <Button variant="ghost" className="text-blue-500 hover:text-blue-600">
            加载更多
          </Button>
        </div>
      )}
    </div>
  );
}
