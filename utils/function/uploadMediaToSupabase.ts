import { createClient } from "../supabase/client";

export async function uploadMediaToSupabase(
  file: File,
  bucketName: string = "post-media",
  pathPrefix: string = "uploads"
): Promise<string | null> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExt ? `.${fileExt}` : ""}`;
  const filePath = `${pathPrefix}/${fileName}`;

  const { error } = await supabase.storage.from(bucketName).upload(filePath, file, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) {
    console.error("上传媒体失败:", error.message);
    return null;
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}
