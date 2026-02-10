'use server';
import PostStore from "@/components/gekaixing/PostStore";

export default async function Page() {
  const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post`, {
    method: 'GET',
    cache: 'no-cache'
  });
  if (result.ok) {
    const data = await result.json();
    if (data.success) {
      return (
        <PostStore data={data.data} />
      );
    }
    return null
  }
  return null
}
