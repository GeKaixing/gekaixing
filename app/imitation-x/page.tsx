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
        <div className="px-4 pt-4">
          <PostStore data={data.data} />
        </div>
      );
    } else { return null }
  }
  return null
}
