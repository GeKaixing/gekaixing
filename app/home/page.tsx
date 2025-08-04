'use server';
import PostCard from "@/components/towel/PostCard";


export default async function Home() {
  const result = await fetch('http://localhost:3000/api/post', {
    method: 'GET',
  });
  const data = await result.json();
  if (data.success) {
    return (
      <div className="flex flex-col gap-6">
        {data.data.map((items: {
          id: string,
          user_id: string,
          user_name: string,
          user_email: string,
          user_avatar: string,
          content: string
          like: number,
          star: number,
          reply_count: number,
          share: number
        }) => (
          <PostCard
            key={items.id}
            id={items.id}
            user_id={items.user_id}
            user_name={items.user_name}
            user_email={items.user_email}
            user_avatar={items.user_avatar}
            content={items.content}
            like={items.like}
            star={items.star}
            reply={items.reply_count}
            share={items.share}
          />
        ))}
      </div>
    );
  }
  return null
}
