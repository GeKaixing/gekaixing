"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Content, Editor } from "@tiptap/react"
import { MinimalTiptapEditor } from "../ui/minimal-tiptap"
import { post_imagesStore } from "@/store/post_images"
import { createClient } from "@/utils/supabase/client"
import { userStore } from "@/store/user"
import { toast } from "sonner"
import { findUnusedUrls } from "@/utils/function/findUnusedUrls"
import { deleteUnusedImages } from "@/utils/function/deleteUnusedImages"
import { postStore } from "@/store/post"
import { postModalStore } from "@/store/postModal"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { uploadMediaToSupabase } from "@/utils/function/uploadMediaToSupabase"
import { Loader2, Music2, Video } from "lucide-react"
import { ToolbarButton } from "../ui/minimal-tiptap/components/toolbar-button"

async function publishPost({
  user_id,
  value,
  videoUrl,
  audioUrl,
}: {
  user_id: string
  value: string
  videoUrl: string | null
  audioUrl: string | null
}) {
  return await fetch("/api/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      content: value,
      videoUrl,
      audioUrl,
    }),
  })
}

interface EditPostProps {
  onClose?: () => void
}

type MentionUser = {
  id: string
  userid: string
  name: string | null
  avatar: string | null
}

type MentionToken = {
  query: string
  from: number
  to: number
}

function getMentionToken(editor: Editor): MentionToken | null {
  const { from } = editor.state.selection
  const lookBack = 60
  const start = Math.max(1, from - lookBack)
  const textBefore = editor.state.doc.textBetween(start, from, "\n", "\n")
  const match = /(?:^|[\s(（])@([^\s@]{0,36})$/u.exec(textBefore)

  if (!match) {
    return null
  }

  const raw = match[0]
  const mentionText = raw.startsWith("@") ? raw : raw.slice(1)
  const mentionStart = from - mentionText.length

  return {
    query: match[1] || "",
    from: mentionStart,
    to: from,
  }
}

async function searchUsers(query: string): Promise<MentionUser[]> {
  try {
    const response = await fetch(`/api/user/search?query=${encodeURIComponent(query)}`)
    const data = await response.json()
    if (!data?.success || !Array.isArray(data?.data)) {
      return []
    }
    return data.data as MentionUser[]
  } catch (error) {
    console.error("Failed to search users:", error)
    return []
  }
}

async function getVideoDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return await new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file)
    const video = document.createElement("video")
    video.preload = "metadata"
    video.src = objectUrl

    const cleanup = (): void => {
      URL.revokeObjectURL(objectUrl)
      video.removeAttribute("src")
      video.load()
    }

    video.onloadedmetadata = () => {
      const width = video.videoWidth
      const height = video.videoHeight
      cleanup()
      if (!width || !height) {
        resolve(null)
        return
      }
      resolve({ width, height })
    }

    video.onerror = () => {
      cleanup()
      resolve(null)
    }
  })
}

export default function EditPost({ onClose }: EditPostProps) {
  const [value, setValue] = useState<Content>("")
  const [editor, setEditor] = useState<Editor | null>(null)
  const [mentionToken, setMentionToken] = useState<MentionToken | null>(null)
  const [mentionUsers, setMentionUsers] = useState<MentionUser[]>([])

  // ⭐ 正确使用 store
  const { isOpen, closeModal, openModal } = postModalStore()

  const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false)
  const [isLogin, setLogin] = useState(false)
  const [saved, setSaved] = useState(false)
  const [status, setStatus] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [uploadedMediaUrls, setUploadedMediaUrls] = useState<string[]>([])
  const [videoUploading, setVideoUploading] = useState(false)
  const [audioUploading, setAudioUploading] = useState(false)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const audioInputRef = useRef<HTMLInputElement | null>(null)
  const wasOpenRef = useRef<boolean>(false)

  const { poset_images } = post_imagesStore()
  const supabase = createClient()
  const { email, id, user_avatar, name, userid } = userStore()

  const bucketName = "images"
  const mediaBucketName = "post-media"

  const t = useTranslations('EditPost')
  const locale = useLocale()
  const router = useRouter()

  // 自动删除未保存图片
  useEffect(() => {
    const isClosing = wasOpenRef.current && !isOpen
    wasOpenRef.current = isOpen

    if (!isClosing) {
      return
    }

    if (poset_images.length !== 0 && !saved) {
      poset_images.forEach((image) => {
        const filePath = image.split("/images/")[1]

        supabase.storage
          .from(bucketName)
          .remove([filePath])
          .catch((error) => {
            console.error("删除图片失败:", error)
          })
      })
    }
    if (!saved) {
      uploadedMediaUrls.forEach((url) => {
        void deleteMediaByUrl(url)
      })
    }

    setValue("")
    setSaved(false)
    setMentionUsers([])
    setMentionToken(null)
    setUploadedMediaUrls([])
    setVideoUploading(false)
    setAudioUploading(false)
  }, [isOpen])

  useEffect(() => {
    if (!editor) {
      return
    }

    const nextToken = getMentionToken(editor)
    setMentionToken(nextToken)
  }, [value, editor])

  useEffect(() => {
    if (!mentionToken) {
      setMentionUsers([])
      return
    }

    const timer = setTimeout(() => {
      void searchUsers(mentionToken.query).then((users) => {
        setMentionUsers(users)
      })
    }, 150)

    return () => {
      clearTimeout(timer)
    }
  }, [mentionToken])

  function handleClose() {
    closeModal()
    onClose?.()
  }

  async function deleteMediaByUrl(url: string | null): Promise<void> {
    if (!url) {
      return
    }

    const key = `${mediaBucketName}/`
    const startIndex = url.indexOf(key)
    if (startIndex === -1) {
      return
    }

    const filePath = url.slice(startIndex + key.length)
    if (!filePath) {
      return
    }

    try {
      const { error } = await supabase.storage.from(mediaBucketName).remove([filePath])
      if (error) {
        console.error("删除媒体失败:", error)
      }
    } catch (error) {
      console.error("删除媒体失败:", error)
    }
  }

  function hasPublishableContent(content: Content): boolean {
    if (typeof content !== "string") {
      return false
    }

    const plainText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, "").trim()
    const hasYouTubeNode = content.includes("data-youtube-embed")
    const hasVideoNode = content.includes("data-video-embed")
    const hasAudioNode = content.includes("data-audio-embed")
    return plainText.length > 0 || hasYouTubeNode || hasVideoNode || hasAudioNode
  }

  function extractEmbeddedMediaUrls(content: string): { videoUrl: string | null; audioUrl: string | null; allUrls: string[] } {
    const videoMatch = /<video\b[^>]*\ssrc=["']([^"']+)["'][^>]*>/i.exec(content)
    const audioMatch = /<audio\b[^>]*\ssrc=["']([^"']+)["'][^>]*>/i.exec(content)
    const allMatches = Array.from(content.matchAll(/<(?:video|audio)\b[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi))
    const allUrls = allMatches
      .map((match) => match[1] ?? "")
      .filter((url) => url.length > 0)

    return {
      videoUrl: videoMatch?.[1] ?? null,
      audioUrl: audioMatch?.[1] ?? null,
      allUrls,
    }
  }

  async function handleMediaUpload(
    file: File,
    type: "video" | "audio"
  ): Promise<void> {
    const isVideo = type === "video"
    const isValidType = isVideo ? file.type.startsWith("video/") : file.type.startsWith("audio/")
    if (!isValidType) {
      toast.error(t(isVideo ? "videoTypeError" : "audioTypeError"))
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error(t("mediaSizeError"))
      return
    }

    const videoDimensions = isVideo ? await getVideoDimensions(file) : null

    if (isVideo) {
      setVideoUploading(true)
    } else {
      setAudioUploading(true)
    }

    try {
      const uploadedUrl = await uploadMediaToSupabase(file, "post-media", type)
      if (!uploadedUrl) {
        toast.error(t("mediaUploadFailed"))
        return
      }

      if (isVideo) {
        editor
          ?.chain()
          .focus()
          .insertVideoEmbed(uploadedUrl, videoDimensions?.width, videoDimensions?.height)
          .run()
      } else {
        editor?.chain().focus().insertAudioEmbed(uploadedUrl).run()
      }

      setUploadedMediaUrls((prev) => (prev.includes(uploadedUrl) ? prev : [...prev, uploadedUrl]))
    } catch (error) {
      console.error(`Failed to upload ${type}:`, error)
      toast.error(t("mediaUploadFailed"))
    } finally {
      if (isVideo) {
        setVideoUploading(false)
      } else {
        setAudioUploading(false)
      }
    }
  }

  async function handleVideoChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0]
    if (file) {
      await handleMediaUpload(file, "video")
    }
    event.target.value = ""
  }

  async function handleAudioChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0]
    if (file) {
      await handleMediaUpload(file, "audio")
    }
    event.target.value = ""
  }

  function extractPlainTextFromHtml(html: string): string {
    return html
      .replace(/<div[^>]*data-youtube-embed[^>]*>[\s\S]*?<\/div>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  function toParagraphHtml(text: string): string {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
    const lines = escaped
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    if (lines.length === 0) {
      return "<p></p>"
    }

    return lines.map((line) => `<p>${line}</p>`).join("")
  }

  async function handleAiPolish(): Promise<void> {
    if (aiGenerating || status) {
      return
    }

    const htmlValue = typeof value === "string" ? value : ""
    const plainText = extractPlainTextFromHtml(htmlValue)

    if (!plainText) {
      toast.error(locale === "zh-CN" ? "请先输入需要润色的内容" : "Please enter content to polish");
      return
    }

    setAiGenerating(true)
    try {
      const response = await fetch("/api/post/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "polish",
          content: plainText,
          locale: locale === "zh-CN" ? "zh-CN" : "en",
        }),
      })

      const payload = (await response.json()) as {
        success?: boolean
        content?: string
        error?: string
        details?: string
      }

      if (!response.ok || !payload.success || !payload.content) {
        if (response.status === 401) {
          toast.error(
            locale === "zh-CN"
              ? "请先在设置-账户中配置 Gemini API Key"
              : "Please configure Gemini API key in Settings > Account first"
          )
          router.push("/gekaixing/settings/account")
          return
        }

        if (response.status === 503) {
          const message = payload.error || ""
          const missingKey =
            message.toLowerCase().includes("not configured") ||
            message.toLowerCase().includes("api key")

          if (missingKey) {
            toast.error(
              locale === "zh-CN"
                ? "请先在设置-账户中配置 Gemini API Key"
                : "Please configure Gemini API key in Settings > Account first"
            )
            router.push("/gekaixing/settings/account")
            return
          }

          toast.error(
            locale === "zh-CN"
              ? "服务器当前无法连接 Gemini，请稍后重试（或检查网络/代理）"
              : "Server cannot reach Gemini right now. Please retry later (or check network/proxy)."
          )
          if (payload.details) {
            console.warn("AI polish details:", payload.details)
          }
          return
        }

        if (response.status === 429) {
          toast.error(
            locale === "zh-CN"
              ? "Gemini 配额已用尽或触发限流，请稍后再试"
              : "Gemini quota exceeded or rate limited, please try again later"
          )
          return
        }

        toast.error(payload.error || (locale === "zh-CN" ? "AI 润色失败" : "AI polish failed"))
        if (payload.details) {
          console.warn("AI polish details:", payload.details)
        }
        return
      }

      const polishedHtml = toParagraphHtml(payload.content)
      setValue(polishedHtml)
      editor?.commands.setContent(polishedHtml)
      toast.success(locale === "zh-CN" ? "润色完成" : "Polish completed")
    } catch (error) {
      console.error("AI polish failed:", error)
      toast.error(locale === "zh-CN" ? "AI 润色失败" : "AI polish failed")
    } finally {
      setAiGenerating(false)
    }
  }

  async function publish() {
    if (!id) {
      setLogin(true)
      return
    }
    if (!hasPublishableContent(value)) {
      return
    }
    if (videoUploading || audioUploading) {
      toast.error(t("mediaUploading"))
      return
    }

    setStatus(true)

    const { videoUrl, audioUrl, allUrls } = extractEmbeddedMediaUrls(value as string)

    const result = await publishPost({
      user_id: id,
      value: value as string,
      videoUrl,
      audioUrl,
    })

    const data = await result.json()
    const unusedPictures = findUnusedUrls(value as string, poset_images)

    if (data.success) {
      postStore.getState().addPost({
        id: data.data[0]["id"],
        user_id: id,
        user_name: name,
        user_email: email,
        user_avatar,
        user_userid: userid,
        content: value as string,
        videoUrl: data.data[0]["videoUrl"] ?? null,
        audioUrl: data.data[0]["audioUrl"] ?? null,
        createdAt: new Date(),
        isPremium: false,
        like: 0,
        star: 0,
        reply: 0,
        share: 0,
        likedByMe: false,
        bookmarkedByMe: false,
        sharedByMe: false,
      })

      setSaved(true)
      setStatus(false)
      closeModal()
      setValue("")
      const unusedMedia = uploadedMediaUrls.filter((url) => !allUrls.includes(url))
      await Promise.all(unusedMedia.map((url) => deleteMediaByUrl(url)))
      setUploadedMediaUrls([])
      toast.success(t("publishSuccess"))
    } else {
      setStatus(false)
      toast.error(t("publishFailed"))
    }

    if (unusedPictures.length !== 0) {
      await deleteUnusedImages("images", unusedPictures)
    }
  }

  function handleSelectMention(user: MentionUser): void {
    if (!editor || !mentionToken) {
      return
    }

    editor
      .chain()
      .focus()
      .deleteRange({ from: mentionToken.from, to: mentionToken.to })
      .insertContent(`@${user.userid} `)
      .run()

    setMentionUsers([])
    setMentionToken(null)
  }

  return (
    <TooltipProvider>
      <Dialog
        open={isOpen}
        onOpenChange={(nextOpen) => {
          // 关闭时有内容 → 拦截
          if (!nextOpen && hasPublishableContent(value)) {
            setIsOpenAlertDialog(true)
            return
          }

          if (nextOpen) {
            openModal()
          } else {
            handleClose()
          }
        }}
      >
        <DialogContent className="!max-w-2xl !w-full">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <MinimalTiptapEditor
            status={status}
            publish={publish}
            value={value}
            onChange={setValue}
            onEditorReady={setEditor}
            onAiGenerate={handleAiPolish}
            aiGenerating={aiGenerating}
            canPublish={hasPublishableContent(value)}
            className="!max-w-[622px] w-full"
            editorContentClassName="p-5"
            output="html"
            placeholder={t("placeholder")}
            autofocus
            editable
            editorClassName="focus:outline-hidden"
            toolbarLeftContent={
              <div className="ml-2 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(event) => void handleVideoChange(event)}
                  />
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(event) => void handleAudioChange(event)}
                  />
                  <ToolbarButton
                    type="button"
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={videoUploading}
                    tooltip={t("uploadVideo")}
                    aria-label={t("uploadVideo")}
                  >
                    {videoUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
                  </ToolbarButton>
                  <ToolbarButton
                    type="button"
                    size="sm"
                    onClick={() => audioInputRef.current?.click()}
                    disabled={audioUploading}
                    tooltip={t("uploadAudio")}
                    aria-label={t("uploadAudio")}
                  >
                    {audioUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Music2 className="h-4 w-4" />}
                  </ToolbarButton>

              </div>
            }
          />
          {mentionUsers.length > 0 && mentionToken ? (
            <div className="mt-2 max-h-56 overflow-y-auto rounded-md border border-border bg-background">
              {mentionUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectMention(user)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/60"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.avatar ?? undefined} />
                    <AvatarFallback>{(user.name || user.userid).slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name || user.userid}</span>
                  <span className="text-xs text-muted-foreground">@{user.userid}</span>
                </button>
              ))}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* 草稿确认弹窗 */}
      <EditAlertDialog
        saved={saved}
        isOpen={isOpenAlertDialog}
        setIsOpen={setIsOpenAlertDialog}
        closeEditPost={handleClose}
      />

      {/* 登录弹窗 */}
      <LoginDialog isOpen={isLogin} setIsOpen={setLogin} />
    </TooltipProvider>
  )
}

function EditAlertDialog({
  isOpen,
  setIsOpen,
  closeEditPost,
  saved,
}: {
  saved: boolean
  closeEditPost: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  const t = useTranslations("EditPost")

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("confirmCloseTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {saved
              ? t("confirmCloseSaved")
              : t("confirmCloseUnsaved")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            {t("cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => {
              setIsOpen(false)
              closeEditPost() // ⭐ 一定会关闭 edit post
            }}
          >
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function LoginDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  const t = useTranslations("EditPost")

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("loginTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("loginDesc")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            {t("cancel")}
          </AlertDialogCancel>

          <AlertDialogAction onClick={() => setIsOpen(false)}>
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
