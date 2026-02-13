import PostRetreat from '@/components/gekaixing/PostRetreat'
import PostStore from '@/components/gekaixing/PostStore'
import PublishReply from '@/components/gekaixing/PublishReply'
import Reply from '@/components/gekaixing/Reply'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
   const postId = params.id[0]

  const result = await fetch(`/api/reply?id=${postId}&type=post_id`, {
    cache: "no-store",
    next: {
      tags: [`reply:post:${postId}`],
    },
  })

  const data = await result.json()

    return (
        <div className='space-y-4'>
            <PostRetreat></PostRetreat>
            {/* 二级 reply使用card的样式  */}
            <PostStore data={data.data}></PostStore>
            <PublishReply id={data.data[0].id}   postId={data.data[0].post_id} post_id={data.data[0].post_id} reply_id={data.data[0].id} type={'reply'} ></PublishReply>
            <Reply post_id={data.data[0].id} type={'reply_id'} />
        </div >
    )

}
