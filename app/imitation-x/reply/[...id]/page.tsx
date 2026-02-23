import PostRetreat from '@/components/gekaixing/PostRetreat'
import PostStore from '@/components/gekaixing/PostStore'
import PublishReply from '@/components/gekaixing/PublishReply'
import Reply from '@/components/gekaixing/Reply'
import { createClient } from '@/utils/supabase/server'

export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = await params;
  const postId = id[0];
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/reply?id=${postId}&type=post_id`, {
    cache: "no-store",
    next: {
      tags: [`reply:post:${postId}`],
    },
  });

  const data = await result.json();

  return (
    <div className='space-y-4'>
      <PostRetreat></PostRetreat>
      <PostStore data={data.data}></PostStore>
      <PublishReply
        postId={postId}
        replyId={postId}
        userId={user?.id}
        type={'reply'}
      ></PublishReply>
      <Reply replies={data.data ?? []} />
    </div >
  );
}
