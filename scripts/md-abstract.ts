export function getMarkdownSummary(
  markdown: string,
  maxLength: number,
): string {
  let plainText = markdown
    // 移除图片保留描述文字
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    // 移除链接保留文字内容
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // 移除加粗格式
    .replace(/\*\*(.*?)\*\*/g, "$1")
    // 移除斜体格式（支持*和_两种形式）
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // 处理行内代码
    .replace(/`([^`]*)`/g, "$1")
    // 处理代码块（保留内容，移除语法标记）
    .replace(/```[\s\S]*?```/g, (match) => {
      const content = match.slice(3, -3);
      const firstNewLine = content.indexOf("\n");
      return firstNewLine === -1 ? content : content.slice(firstNewLine + 1);
    })
    // 移除标题标记
    .replace(/#+\s+/g, "")
    // 移除无序列表标记
    .replace(/^\s*[-*+]\s+/gm, "")
    // 移除有序列表标记
    .replace(/^\s*\d+\.\s+/gm, "")
    // 移除引用标记
    .replace(/^>\s*/gm, "")
    // 移除水平分割线
    .replace(/^-{3,}/gm, "")
    // 合并连续空白字符
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 返回截取指定长度的结果
  return plainText.slice(0, maxLength).concat("...");
}
