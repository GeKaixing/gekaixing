export  function findUnusedUrls(htmlString: string, allUrls: string[]) {
  // 1. 从HTML字符串中提取图片URL
  const usedUrls: string[] = [];
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  while ((match = imgRegex.exec(htmlString)) !== null) {
    usedUrls.push(match[1]);
  }

  // 2. 找出未使用的URL
  const unusedUrls = allUrls.filter((url) => !usedUrls.includes(url));

  return unusedUrls;
}
