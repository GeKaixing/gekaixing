"use client"

import { useEffect, useState } from "react"
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

async function publishPost({
  user_id,
  value,
}: {
  user_id: string
  value: string
}) {
  return await fetch("/api/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      content: value,
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

  const { poset_images } = post_imagesStore()
  const supabase = createClient()
  const { email, id, user_avatar, name, userid } = userStore()

  const bucketName = "images"

  const t = useTranslations('EditPost')

  // 自动删除未保存图片
  useEffect(() => {
    if (!isOpen && poset_images.length !== 0 && !saved) {
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

    if (!isOpen) {
      setValue("")
      setSaved(false)
      setMentionUsers([])
      setMentionToken(null)
    }
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

  async function publish() {
    if (!id) {
      setLogin(true)
      return
    }

    setStatus(true)

    const result = await publishPost({
      user_id: id,
      value: value as string,
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
          if (!nextOpen && value !== "") {
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
            className="!max-w-[622px] w-full"
            editorContentClassName="p-5"
            output="html"
            placeholder={t("placeholder")}
            autofocus
            editable
            editorClassName="focus:outline-hidden"
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
