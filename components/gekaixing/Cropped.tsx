"use client"

import "react-advanced-cropper/dist/style.css"
import React, { useEffect, useRef, useState } from "react"
import { CropperRef, Cropper, CircleStencil } from "react-advanced-cropper"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Button from "./Button"
import { Input } from "../ui/input"
import Spin from "./Spin"
import clsx from "clsx"
import { toast } from "sonner"
import { userStore } from "@/store/user"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

export default function Cropped({
  open,
  onOpenChange,
  type,
  fetch: updateProfileImage,
  user_background_image,
  user_avatar,
}: {
  user_background_image?: string
  user_avatar?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  type: string
  fetch: (url: string) => Promise<Response>
}) {
  const t = useTranslations("Account.Cropped")
  const isAvatarMode = type === "use-avatar" || type === "user-avatar"
  const isBackgroundMode = type === "user-background-image"
  const canGenerateByAi = isAvatarMode || isBackgroundMode

  const [image, setImage] = useState(
    user_background_image ||
      user_avatar ||
      "https://images.unsplash.com/photo-1599140849279-1014532882fe"
  )

  const cropperRef = useRef<CropperRef>(null)
  const [status, setStatus] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isButton, setButton] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) {
        URL.revokeObjectURL(image)
      }
    }
  }, [image])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImage(url)
  }

  function canvasToFile(canvas: HTMLCanvasElement): Promise<File> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Failed to create image blob"))

          resolve(
            new File([blob], `${type}.png`, {
              type: "image/png",
            })
          )
        },
        "image/png"
      )
    })
  }

  async function uploadImage(file: File) {
    const userId = userStore.getState().id || "anonymous"
    const filePath = `${type}/${userId}.png`

    const { error } = await supabase.storage.from("images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) throw error

    const { data } = supabase.storage.from("images").getPublicUrl(filePath)
    return `${data.publicUrl}?t=${Date.now()}`
  }

  const handleUpload = async () => {
    if (!cropperRef.current) return

    const canvas = cropperRef.current.getCanvas()
    if (!canvas) return

    try {
      setStatus(true)

      const file = await canvasToFile(canvas)
      const url = await uploadImage(file)
      const res = await updateProfileImage(url)
      const data = await res.json()

      if (data.success) {
        toast.success(t("updateSuccess"))

        if (type === "user-background-image") {
          userStore.setState({ user_background_image: url })
          router.refresh()
        } else {
          userStore.setState({ user_avatar: url })
          router.refresh()
        }

        onOpenChange(false)
      } else {
        toast.error(t("updateFailed"))
      }
    } catch (err) {
      console.error(err)
      toast.error(t("uploadFailed"))
    } finally {
      setStatus(false)
    }
  }

  const handleGenerateImageByAi = async () => {
    const prompt = aiPrompt.trim()
    if (!prompt || aiLoading) return

    try {
      setAiLoading(true)
      const response = await fetch("/api/user/avatar/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          target: isBackgroundMode ? "background" : "avatar",
        }),
      })

      const payload = (await response.json()) as {
        success?: boolean
        imageBase64?: string
        mimeType?: string
        error?: string
        details?: string
      }

      if (!response.ok || !payload.success || !payload.imageBase64) {
        if (response.status === 401 || response.status === 503) {
          const message = payload.error || ""
          const missingKey =
            message.toLowerCase().includes("not configured") ||
            message.toLowerCase().includes("api key")

          if (missingKey) {
            toast.error(t("missingKey"))
            router.push("/gekaixing/settings/account")
            return
          }
        }

        if (response.status === 429) {
          toast.error(t("quotaExceeded"))
          return
        }

        toast.error(
          payload.error ||
            (isBackgroundMode ? t("aiGenerateFailedBackground") : t("aiGenerateFailed"))
        )
        if (payload.details) {
          console.warn("AI avatar details:", payload.details)
        }
        return
      }

      const dataUrl = `data:${payload.mimeType || "image/png"};base64,${payload.imageBase64}`
      setImage(dataUrl)
      setButton(true)
      toast.success(isBackgroundMode ? t("aiGenerateSuccessBackground") : t("aiGenerateSuccess"))
    } catch (error) {
      console.error(error)
      toast.error(isBackgroundMode ? t("aiGenerateFailedBackground") : t("aiGenerateFailed"))
    } finally {
      setAiLoading(false)
    }
  }

  const onChange = () => {
    setButton(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="hidden" />

      <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {isBackgroundMode ? "Edit background image" : "Edit avatar image"}
          </DialogTitle>
        </DialogHeader>

        {type === "user-background-image" ? (
          <Cropper
            ref={cropperRef}
            src={image}
            stencilProps={{
              aspectRatio: 16 / 9,
              movable: true,
              resizable: true,
            }}
            onChange={onChange}
            style={{ width: "100%", height: "400px" }}
          />
        ) : (
          <Cropper
            ref={cropperRef}
            src={image}
            stencilComponent={CircleStencil}
            onChange={onChange}
            style={{ width: "100%", height: "400px" }}
          />
        )}

        {status ? (
          <DialogFooter className="flex justify-center">
            <Spin />
          </DialogFooter>
        ) : (
          <DialogFooter className="w-full flex-col gap-4 sm:flex-col sm:justify-start">
            {canGenerateByAi ? (
              <div className="w-full rounded-xl border border-border p-3">
                <div className="text-sm font-medium">
                  {isBackgroundMode ? t("aiSectionTitleBackground") : t("aiSectionTitle")}
                </div>
                <div className="mt-2 flex w-full flex-col gap-2">
                  <Input
                    value={aiPrompt}
                    onChange={(event) => setAiPrompt(event.target.value)}
                    disabled={aiLoading}
                    placeholder={
                      isBackgroundMode ? t("aiPromptPlaceholderBackground") : t("aiPromptPlaceholder")
                    }
                  />
                  <Button
                    type="button"
                    disabled={aiLoading || !aiPrompt.trim()}
                    onClick={() => {
                      void handleGenerateImageByAi()
                    }}
                    className={clsx({
                      "bg-black text-white": !aiLoading && !!aiPrompt.trim(),
                    })}
                  >
                    {aiLoading ? <Spin /> : <Sparkles className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ) : null}

            <Input className="w-full" type="file" accept="image/*" onChange={handleFileChange} />

            <Button
              disabled={!isButton || aiLoading}
              onClick={handleUpload}
              className={clsx("w-full", {
                "bg-black text-white": isButton,
              })}
            >
              {t("confirm")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
