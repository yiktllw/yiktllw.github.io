export const slugify = (s: string) =>
  encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-"));

export interface Heading {
  title: string;
  link: string;
  level: number;
  children: Heading[];
}

function extractHeadingsFromMdStr(md_str: string): Heading[] {
  const lines = md_str.split("\n");
  const headings: Heading[] = [];
  const result: Heading[] = [];
  const stack: Heading[] = [];

  // 提取所有标题
  lines.forEach((line) => {
    const match = line.match(/^(#+)\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      headings.push({
        title,
        link: `#${slugify(title)}`,
        level,
        children: [],
      });
    }
  });

  // 构建树形结构
  for (const heading of headings) {
    // 弹出栈顶元素直到找到父级
    while (stack.length > 0 && heading.level <= stack[stack.length - 1].level) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(heading);
    } else {
      stack[stack.length - 1].children.push(heading);
    }

    stack.push(heading);
  }

  return result;
}

export function generateToc(md_str: string): [Heading[], string] {
  const headings = extractHeadingsFromMdStr(md_str);

  function escapeHtml(text: string): string {
    return (
      text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        // escape Vue
        .replace(/\{\{/g, "&#123;&#123;")
        .replace(/\}\}/g, "&#125;&#125;")
    );
  }

  // side effects
  let g_index = 0;

  function renderToc(
    headings: Heading[],
    relative_depth = 0,
    current_prefix = "",
  ): string {
    if (headings.length === 0) {
      return "";
    }
    let html = `<ul class=\"depth-${relative_depth}\">`;
    headings.forEach((heading, heading_index) => {
      html += `<li><a href="${heading.link}" :class="${g_index} === current_heading ? 'active' : 'not-active'">${current_prefix}${heading_index + 1}&nbsp;${escapeHtml(heading.title)}</a>`;
      g_index++;
      if (heading.children.length > 0) {
        html += renderToc(
          heading.children,
          relative_depth + 1,
          `${current_prefix}${heading_index + 1}.`,
        );
      }
      html += "</li>";
    });
    html += "</ul>";
    return html;
  }

  return [headings, renderToc(headings)];
}
