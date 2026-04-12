interface UploadFileResponse {
  data?: {
    path: string;
    publicUrl: string;
  };
  error?: string;
}

interface DeleteFilesResponse {
  data?: string[];
  error?: string;
}

function buildFilePath(file: File, pathPrefix: string): string {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${fileExt ? `.${fileExt}` : ""}`;
  return `${pathPrefix}/${fileName}`;
}

export async function uploadFileToLocalStorage(
  file: File,
  bucketName: string,
  pathPrefix: string,
): Promise<string | null> {
  try {
    const filePath = buildFilePath(file, pathPrefix);
    const formData = new FormData();
    formData.append("bucket", bucketName);
    formData.append("filePath", filePath);
    formData.append("file", file);

    const response = await fetch("/api/storage/upload", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as UploadFileResponse;

    if (!response.ok || !result.data?.publicUrl) {
      console.error("上传文件失败:", result.error ?? "Unknown upload error");
      return null;
    }

    return result.data.publicUrl;
  } catch (error) {
    console.error("上传文件失败:", error);
    return null;
  }
}

export async function deleteFilesFromLocalStorage(bucket: string, paths: string[]): Promise<DeleteFilesResponse> {
  if (paths.length === 0) {
    return { data: [], error: undefined };
  }

  try {
    const response = await fetch("/api/storage/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bucket, paths }),
    });
    const result = (await response.json()) as DeleteFilesResponse;

    if (!response.ok) {
      return { data: [], error: result.error ?? "Delete failed" };
    }

    return { data: result.data ?? [], error: undefined };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}
