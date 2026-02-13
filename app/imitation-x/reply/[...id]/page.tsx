import PostRetreat from '@/components/gekaixing/PostRetreat'
import PostStore from '@/components/gekaixing/PostStore'
import PublishReply from '@/components/gekaixing/PublishReply'
import Reply from '@/components/gekaixing/Reply'

export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = await params;
  const postId = id[0];

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
      <PublishReply id={data.data[0].id} postId={data.data[0].post_id} post_id={data.data[0].post_id} reply_id={data.data[0].id} type={'reply'} ></PublishReply>
      <Reply post_id={data.data[0].id} type={'reply_id'} />
    </div >
  );
}
