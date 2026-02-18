"use client";

import { notFound, usePathname, useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ShieldCheck, UserCheck, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function getID(pathname: string): string | null {
    const pathSegments = pathname.split("/").filter(Boolean);
    const statusIndex = pathSegments.indexOf("status");

    if (statusIndex !== -1 && pathSegments.length > statusIndex + 1) {
        return pathSegments[statusIndex + 1];
    }

    return null;
}

interface PostData {
    id: string;
    author: {
        id: string;
        userid: string;
        name: string;
        avatar: string | null;
        briefIntroduction: string | null;
        isFollowing: boolean;
        isPremium: boolean;
    };
}

export default function FollowCard() {
    const pathname = usePathname();
    const [result, setResult] = useState<PostData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFoundError, setNotFoundError] = useState(false);
    const [isShow, setShow] = useState(false);
    const router = useRouter()

    // ⭐ follow/unfollow
    const handleFollow = async (targetUserId: string) => {
        try {
            const res = await fetch("/api/follow", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ targetUserId }),
            });

            if (!res.ok) throw new Error("follow failed");

            // 乐观更新
            setResult(prev =>
                prev
                    ? {
                        ...prev,
                        author: {
                            ...prev.author,
                            isFollowing: !prev.author.isFollowing,
                        },
                    }
                    : prev
            );
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            if (!pathname.includes("/imitation-x/status/")) {
                setShow(false);
                return;
            }

            setShow(true);
            setLoading(true);

            try {
                const statusId = getID(pathname);
                if (!statusId) throw new Error();

                const res = await fetch(`/api/follow/card/${statusId}`);

                if (!res.ok) {
                    if (res.status === 404) setNotFoundError(true);
                    return;
                }

                setResult(await res.json());
            } catch {
                setNotFoundError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [pathname]);

    if (notFoundError) notFound();
    if (!isShow) return null;

    return (
        <Card className="p-4 border rounded-lg">
            {loading ? (
                <div className="text-sm text-gray-500">加载中...</div>
            ) : result ? (
                <div className="flex items-start justify-between gap-2">
                    <Avatar onClick={() => router.push(`/imitation-x/user/${result.author.id}`)} className="w-12 h-12 shrink-0">
                        <AvatarImage src={result.author.avatar || ""} />
                        <AvatarFallback>u</AvatarFallback>
                    </Avatar>

                    <div>
                        <Link
                            href={`/imitation-x/user/${result.author.id}`}
                            className="font-bold text-sm hover:underline flex items-center"
                        >
                            {result.author.name}
                            {result.author.isPremium && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                        </Link>

                        <p className="text-sm text-gray-500 truncate max-w-[120px]">
                            @{result.author.userid}
                        </p>

                        <p className="text-sm mt-1 truncate  max-w-[140px]">
                            {result.author.briefIntroduction || '还没有介绍自己'}
                        </p>
                    </div>

                    <Button
                        onClick={() => handleFollow(result.author.id)}
                        variant={result.author.isFollowing ? "outline" : "default"}
                        size="sm"
                        className={cn(
                            "rounded-full font-bold",
                            result.author.isFollowing
                                ? "hover:border-red-300 hover:text-red-500"
                                : "bg-black text-white"
                        )}
                    >
                        {result.author.isFollowing ? (
                            <>
                                <UserCheck className="w-4 h-4 mr-1" />
                                已关注
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4 mr-1" />
                                关注
                            </>
                        )}
                    </Button>
                </div>
            ) : (
                <div className="text-sm text-gray-500">未找到数据</div>
            )}
        </Card>
    );
}
