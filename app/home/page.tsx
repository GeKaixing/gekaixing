'use server';
import PostStore from "@/components/towel/PostStore";


export default async function Home() {
  const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post`, {
    method: 'GET',
    cache:'no-cache'
  });
  const data = await result.json();
  if (data.success) {
    return (
      <PostStore data={data.data} />
    );
  }
  return null
}
