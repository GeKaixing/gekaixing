"use client";

import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "next-intl";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_GEMINI_MODEL, GEMINI_MODEL_OPTIONS, normalizeGeminiModel } from "@/lib/gemini-model";
import { createClient } from "@/utils/supabase/client";
import SettingAccountLi from "./SettingAccountLi";
import Spin from "./Spin";

function maskApiKey(key: string, configuredText: string): string {
  if (key.length < 10) {
    return configuredText;
  }

  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

type SettingGeminiKeyText = {
  configured: string;
  loginFirst: string;
  saveFailed: string;
  saved: string;
  cleared: string;
  keyLabel: string;
  dialogTitle: string;
  dialogDescription: string;
  inputPlaceholder: string;
  modelLabel: string;
  modelPlaceholder: string;
  clearHint: string;
  saveButton: string;
  noKeyText: string;
};

function getText(locale: string): SettingGeminiKeyText {
  if (locale === "zh-CN") {
    return {
      configured: "已配置",
      loginFirst: "请先登录",
      saveFailed: "保存失败",
      saved: "Gemini Key 已保存",
      cleared: "Gemini Key 已清空",
      keyLabel: "Gemini API Key",
      dialogTitle: "Gemini API Key",
      dialogDescription: "配置你自己的 Gemini Key，用于 AI 发帖和会话标题生成。",
      inputPlaceholder: "请输入 Gemini Key（例如 AIzaSy...）",
      modelLabel: "Gemini 模型",
      modelPlaceholder: "请选择模型",
      clearHint: "输入框留空并保存即可清空当前 Key。",
      saveButton: "保存",
      noKeyText: "我没有key",
    };
  }

  return {
    configured: "Configured",
    loginFirst: "Please login first",
    saveFailed: "Save failed",
    saved: "Gemini key saved",
    cleared: "Gemini key cleared",
    keyLabel: "Gemini API Key",
    dialogTitle: "Gemini API Key",
    dialogDescription:
      "Save your own Gemini key for AI post generation and chat title generation.",
    inputPlaceholder: "Enter Gemini key (for example AIzaSy...)",
    modelLabel: "Gemini Model",
    modelPlaceholder: "Choose model",
    clearHint: "Leave blank and save to clear your key.",
    saveButton: "Save",
    noKeyText: "I don't have a key",
  };
}

export default function SettingGeminiKey() {
  const locale = useLocale();
  const text = getText(locale);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [savedModel, setSavedModel] = useState(DEFAULT_GEMINI_MODEL);
  const [modelInput, setModelInput] = useState(DEFAULT_GEMINI_MODEL);

  useEffect(() => {
    const init = async (): Promise<void> => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const storedKey =
        typeof user?.user_metadata?.gemini_api_key === "string"
          ? user.user_metadata.gemini_api_key
          : "";
      const storedModel = normalizeGeminiModel(user?.user_metadata?.gemini_model);

      setSavedKey(storedKey);
      setSavedModel(storedModel);
    };

    void init();
  }, []);

  async function loadCurrentKey(): Promise<void> {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      toast.error(text.loginFirst);
      return;
    }

    const storedKey =
      typeof user.user_metadata?.gemini_api_key === "string"
        ? user.user_metadata.gemini_api_key
        : "";
    const storedModel = normalizeGeminiModel(user.user_metadata?.gemini_model);

    setSavedKey(storedKey);
    setKeyInput(storedKey);
    setSavedModel(storedModel);
    setModelInput(storedModel);
  }

  async function saveGeminiKey(): Promise<void> {
    setLoading(true);
    try {
      const value = keyInput.trim();
      const selectedModel = normalizeGeminiModel(modelInput);
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error(text.loginFirst);
        return;
      }

      const nextMetadata: Record<string, unknown> = {
        ...(user.user_metadata ?? {}),
      };

      if (value) {
        nextMetadata.gemini_api_key = value;
      } else {
        delete nextMetadata.gemini_api_key;
      }
      nextMetadata.gemini_model = selectedModel;

      const { data, error } = await supabase.auth.updateUser({
        data: nextMetadata,
      });

      if (error) {
        toast.error(error.message || text.saveFailed);
        return;
      }

      const nextStoredKey =
        typeof data.user?.user_metadata?.gemini_api_key === "string"
          ? data.user.user_metadata.gemini_api_key
          : "";
      const nextStoredModel = normalizeGeminiModel(data.user?.user_metadata?.gemini_model);

      setSavedKey(nextStoredKey);
      setKeyInput(nextStoredKey);
      setSavedModel(nextStoredModel);
      setModelInput(nextStoredModel);
      toast.success(nextStoredKey ? text.saved : text.cleared);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          void loadCurrentKey();
        }
      }}
    >
      <DialogTrigger asChild>
        <button type="button" className="w-full text-left">
          <SettingAccountLi
            icon={<KeyRound />}
            text={`${text.keyLabel}${savedKey ? ` (${maskApiKey(savedKey, text.configured)})` : ""} · ${savedModel}`}
          />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{text.dialogTitle}</DialogTitle>
          <DialogDescription>{text.dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Input
              type="password"
              placeholder={text.inputPlaceholder}
              value={keyInput}
              onChange={(event) => setKeyInput(event.target.value)}
              disabled={loading}
            />
            <Link
              href="https://aistudio.google.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-sm text-blue-600 hover:underline"
            >
              {text.noKeyText}
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            {text.clearHint}
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium">{text.modelLabel}</p>
            <Select value={modelInput} onValueChange={(value) => setModelInput(normalizeGeminiModel(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={text.modelPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {GEMINI_MODEL_OPTIONS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            className="bg-black text-white"
            onClick={() => {
              void saveGeminiKey();
            }}
            disabled={loading}
          >
            {loading ? <Spin /> : text.saveButton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
