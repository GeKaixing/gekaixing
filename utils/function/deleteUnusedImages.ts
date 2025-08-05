import { createClient } from "../supabase/client";
export async function deleteUnusedImages(
  bucket: string,
  UnusedImages: string[]
) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket) // 替换成你实际的桶名称
    .remove(UnusedImages);

  return { data, error };
}
