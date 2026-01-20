import { NovelEpisode } from '../types';

export function generateHTML(episode: NovelEpisode): string {
  const { title, header, blocks, style } = episode;

  const aspectRatioMap: Record<string, string> = {
    '21:9': '42.857%',
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
    '3:4': '133.333%',
    '9:16': '177.778%',
    'original': 'auto'
  };

  // Generate hero image HTML
  let heroImageHTML = '';
  if (header.heroImageUrl) {
    const paddingBottom = aspectRatioMap[header.heroImageAspectRatio || '16:9'];

    if (header.heroImageLayout === 'background') {
      const alignment = getTitleAlignment(header.titlePosition || 'center');
      heroImageHTML = `
        <div style="position: relative; width: 100%; padding-bottom: ${paddingBottom}; background-image: url('${header.heroImageUrl}'); background-size: cover; background-position: center; margin-bottom: 2rem;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: ${alignment.vertical}; justify-content: ${alignment.horizontal}; padding: 2rem;">
            <div style="text-align: center; color: ${header.titleColor || '#fff'}; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">
              <h1 style="font-size: 3rem; font-weight: 900; margin-bottom: 0.5rem; margin-top: 0;">${escapeHtml(title)}</h1>
              ${header.subtitle ? `<p style="font-size: 1.25rem; color: ${header.subtitleColor || '#fff'}; margin-bottom: 0.5rem; margin-top: 0;">${escapeHtml(header.subtitle)}</p>` : ''}
              ${header.author ? `<p style="font-size: 1rem; color: ${header.authorColor || '#fff'}; margin-top: 0; margin-bottom: 0;">${escapeHtml(header.author)}</p>` : ''}
            </div>
          </div>
        </div>
      `;
    } else if (header.heroImageLayout === 'above') {
      heroImageHTML = `<div style="width: 100%; padding-bottom: ${paddingBottom}; background-image: url('${header.heroImageUrl}'); background-size: cover; background-position: center; margin-bottom: 2rem;"></div>`;
    } else if (header.heroImageLayout === 'below') {
      heroImageHTML = `<div style="width: 100%; padding-bottom: ${paddingBottom}; background-image: url('${header.heroImageUrl}'); background-size: cover; background-position: center; margin-top: 2rem;"></div>`;
    }
  }

  // Generate header (when not using background layout)
  const headerHTML = (header.heroImageLayout !== 'background' || !header.heroImageUrl) ? `
    <div style="text-align: center; margin-bottom: 3rem;">
      <h1 style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem; margin-top: 0; color: ${header.titleColor || style.bodyText};">${escapeHtml(title)}</h1>
      ${header.subtitle ? `<p style="font-size: 1.125rem; color: ${header.subtitleColor || style.bodyText}; opacity: 0.7; margin-bottom: 0.5rem; margin-top: 0;">${escapeHtml(header.subtitle)}</p>` : ''}
      ${header.author ? `<p style="font-size: 0.875rem; color: ${header.authorColor || style.bodyText}; opacity: 0.6; font-weight: 700; margin-top: 0; margin-bottom: 0;">${escapeHtml(header.author)}</p>` : ''}
      ${header.tags && header.tags.length > 0 ? `<div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap;">${header.tags.map(tag => `<span style="background: ${style.highlightBg}; color: ${style.highlightText}; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 700;">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
    </div>
  ` : '';

  // Generate body with inline styles
  const bodyHTML = blocks.map(block => {
    const processedText = processDialogue(escapeHtml(block.text), style.highlightBg, style.highlightText);
    return `<p style="margin-bottom: 1.5rem; margin-top: 0; line-height: ${style.lineHeight}; letter-spacing: ${style.letterSpacing}px; color: ${style.bodyText};">${processedText}</p>`;
  }).join('\n');

  // Generate complete HTML with all inline styles
  const containerHTML = `
<div style="font-family: ${style.fontFamily}; background: ${style.transparentOuter ? 'transparent' : style.outerBg}; padding: 2rem;">
  <div style="max-width: 800px; margin: 0 auto; background: ${style.cardBg}; padding: 3rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    ${header.heroImageLayout === 'above' && header.heroImageUrl ? heroImageHTML : ''}
    ${header.heroImageLayout === 'background' && header.heroImageUrl ? heroImageHTML : headerHTML}
    ${header.heroImageLayout !== 'above' && header.heroImageLayout !== 'background' && !header.heroImageUrl ? headerHTML : ''}
    <div style="font-size: ${style.fontSize}px; color: ${style.bodyText};">
      ${bodyHTML}
    </div>
    ${header.heroImageLayout === 'below' && header.heroImageUrl ? heroImageHTML : ''}
  </div>
</div>`;

  return containerHTML.trim();
}

function getTitleAlignment(position: string) {
  const map: Record<string, { vertical: string; horizontal: string }> = {
    center: { vertical: 'center', horizontal: 'center' },
    tl: { vertical: 'flex-start', horizontal: 'flex-start' },
    tr: { vertical: 'flex-start', horizontal: 'flex-end' },
    bl: { vertical: 'flex-end', horizontal: 'flex-start' },
    br: { vertical: 'flex-end', horizontal: 'flex-end' },
  };
  return map[position] || map.center;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function processDialogue(text: string, highlightBg: string, highlightText: string): string {
  // Replace quotes with highlighted spans
  return text
    .replace(/"([^"]+)"/g, `<span style="background: ${highlightBg}; color: ${highlightText}; padding: 2px 6px; border-radius: 4px;">"$1"</span>`)
    .replace(/“([^”]+)”/g, `<span style="background: ${highlightBg}; color: ${highlightText}; padding: 2px 6px; border-radius: 4px;">“$1”</span>`)
    .replace(/「([^」]+)」/g, `<span style="background: ${highlightBg}; color: ${highlightText}; padding: 2px 6px; border-radius: 4px;">「$1」</span>`);
}

export function copyHTMLToClipboard(html: string): Promise<void> {
  return navigator.clipboard.writeText(html);
}

export function downloadHTML(html: string, filename: string): void {
  // For download, wrap in full HTML document
  const fullHTML = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&family=Nanum+Myeongjo:wght@400;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
${html}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}