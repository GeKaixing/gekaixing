import { toast } from "sonner";

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text)
    .then(() => {
        toast.success('复制成功');
    })
    .catch(() => {
        toast.error('复制失败');
         // 处理复制失败的情况
         // 例如，显示错误消息或执行其他操作
         // console.error('复制失败:', err);
    });
}