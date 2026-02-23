"use client";

import { use, useCallback, useEffect, useState } from "react";
import { ArrowLeft, Search, UserPlus, UserCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface UserProfile {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    bio: string;
    isFollowing: boolean;
    isVerified?: boolean;
}

type TabType = "recommended" | "followers" | "following";

export default function Page({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}) {
    const { slug } = use(params);
    const profileId = slug[0];
    const [activeTab, setActiveTab] = useState<TabType>("recommended");
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const router = useRouter();

    // ===== 获取用户列表 =====
    const fetchUsers = useCallback(async (tab: TabType) => {
        setLoading(true);

        try {
            const res = await fetch(
                `/api/user/${profileId}/relations?type=${tab}`
            );

            const data = await res.json();

            if (data.success) {
                setUsers(data.users);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [profileId]);

    // tab 变化时请求
    useEffect(() => {
        fetchUsers(activeTab);
    }, [activeTab, fetchUsers]);

    // ===== 关注 / 取消关注 =====
    const handleFollow = async (targetId: string) => {
        const targetUser = users.find((u) => u.id === targetId);
        if (!targetUser) return;

        // 乐观更新 UI
        setUsers((prev) =>
            prev.map((user) =>
                user.id === targetId
                    ? { ...user, isFollowing: !user.isFollowing }
                    : user
            )
        );

        try {
            if (targetUser.isFollowing) {
                await fetch("/api/follow", {
                    method: "DELETE",
                    body: JSON.stringify({ targetId }),
                });
            } else {
                await fetch("/api/follow", {
                    method: "POST",
                    body: JSON.stringify({ targetId }),
                });
            }
        } catch (err) {
            console.error(err);
            fetchUsers(activeTab); // 回滚
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.handle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tabs = [
        { id: "recommended" as TabType, label: "推荐关注" },
        { id: "followers" as TabType, label: "关注者" },
        { id: "following" as TabType, label: "正在关注" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* header */}
            <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border">
                <div className="flex items-center gap-4 px-4 py-3">
                    <div
                        onClick={() => router.back()}
                        className="p-2 hover:bg-muted/70 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold">用户关系</h1>
                        <p className="text-sm text-muted-foreground">
                            {users.length} 位用户
                        </p>
                    </div>
                </div>

                {/* search */}
                <div className="px-4 py-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                        <input
                            type="text"
                            placeholder="搜索用户"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-muted rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* tabs */}
                <div className="flex border-b border-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-1 py-3 text-sm font-medium",
                                activeTab === tab.id
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* list */}
            <div className="divide-y divide-border">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">加载中...</div>
                ) : filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className="flex gap-3 px-4 py-3 hover:bg-muted/60 transition-colors"
                    >
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                                {user.name?.slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-bold">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {user.handle}
                                    </p>
                                </div>

                                <Button
                                    onClick={() => handleFollow(user.id)}
                                    variant={user.isFollowing ? "outline" : "default"}
                                >
                                    {user.isFollowing ? (
                                        <UserCheck className="w-4 h-4" />
                                    ) : (
                                        <UserPlus className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>

                            <p className="text-sm mt-1">{user.bio}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
