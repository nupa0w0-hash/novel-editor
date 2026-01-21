import { NovelEpisode, Chapter, Section } from '../types';

export type CollapseMode = 'all-expanded' | 'all-collapsed';
export type ExportViewport = 'desktop' | 'mobile';

export function generateHTML(
  episode: NovelEpisode,
  collapseMode: CollapseMode = 'all-expanded',
  viewport: ExportViewport = 'desktop'
): string {
  const { title, header, style, chapters } = episode;

  const aspectRatioMap: Record<string, string> = {
    '21:9': '42.857%',
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
    '3:4': '133.333%',
    '9:16': '177.778%',
    original: 'auto',
  };

  // For bulletin board paste: use minimal outer padding and safe inner padding
  // to prevent overflow on mobile screens. Box-sizing: border-box ensures padding
  // is included in width calculations.
  const baseLayout = {
    maxWidth: '800px',
    outerPadding: '0.5rem',  // Reduced from 2rem to prevent mobile overflow
    headerTitleSize: '2.5rem',
    headerTitleSizeBg: '3rem',
    headerSubtitleSize: '1.125rem',
    headerSubtitleSizeBg: '1.25rem',
    headerAuthorSize: '0.875rem',
    headerAuthorSizeBg: '1rem',
    heroPadding: '1.5rem',  // Reduced from 2rem
  };

  // Use fixed padding in rem/px for bulletin boards (% can cause issues)
  const layout =
    viewport === 'mobile'
      ? {
          ...baseLayout,
          innerPadding: '2rem 1rem',  // Reduced: mobile needs minimal horizontal padding
        }
      : {
          ...baseLayout,
          innerPadding: '2.5rem 1.5rem',  // Reduced from '3rem 15%'
        };

  // Apply titlePosition also when there is no hero image.
  // For non-background headers, vertical positions are interpreted as horizontal alignment only.
  const headerAlignment = getTitleAlignment(header.titlePosition || 'center');
  const headerTextAlign =
    headerAlignment.horizontal === 'flex-start' ? 'left' : headerAlignment.horizontal === 'flex-end' ? 'right' : 'center';
  const headerTagsJustify =
    headerAlignment.horizontal === 'flex-start' ? 'flex-start' : headerAlignment.horizontal === 'flex-end' ? 'flex-end' : 'center';

  // Generate hero image HTML
  let heroImageHTML = '';
  if (header.heroImageUrl) {
    const paddingBottom = aspectRatioMap[header.heroImageAspectRatio || '16:9'];

    if (header.heroImageLayout === 'background') {
      const alignment = getTitleAlignment(header.titlePosition || 'center');
      const textAlign =
        alignment.horizontal === 'flex-start' ? 'left' : alignment.horizontal === 'flex-end' ? 'right' : 'center';

      heroImageHTML = `
        <div style="position: relative; width: 100%; padding-bottom: ${paddingBottom}; background-image: url('${header.heroImageUrl}'); background-size: cover; background-position: center; margin-bottom: 2rem;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: ${alignment.vertical}; justify-content: ${alignment.horizontal}; padding: ${layout.heroPadding};">
            <div style="text-align: ${textAlign}; color: ${header.titleColor || '#fff'}; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">
              <h1 style="font-size: ${layout.headerTitleSizeBg}; font-weight: 900; margin-bottom: 0.5rem; margin-top: 0;">${escapeHtml(title)}</h1>
              ${header.subtitle ? `<p style="font-size: ${layout.headerSubtitleSizeBg}; color: ${header.subtitleColor || '#fff'}; margin-bottom: 0.5rem; margin-top: 0;">${escapeHtml(header.subtitle)}</p>` : ''}
              ${header.author ? `<p style="font-size: ${layout.headerAuthorSizeBg}; color: ${header.authorColor || '#fff'}; margin-top: 0; margin-bottom: 0;">${escapeHtml(header.author)}</p>` : ''}
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
  const headerHTML =
    header.heroImageLayout !== 'background' || !header.heroImageUrl
      ? `
    <div style="text-align: ${headerTextAlign}; margin-bottom: 3rem;">
      <h1 style="font-size: ${layout.headerTitleSize}; font-weight: 900; margin-bottom: 0.5rem; margin-top: 0; color: ${header.titleColor || style.bodyText};">${escapeHtml(title)}</h1>
      ${header.subtitle ? `<p style="font-size: ${layout.headerSubtitleSize}; color: ${header.subtitleColor || style.bodyText}; opacity: 0.7; margin-bottom: 0.5rem; margin-top: 0;">${escapeHtml(header.subtitle)}</p>` : ''}
      ${header.author ? `<p style="font-size: ${layout.headerAuthorSize}; color: ${header.authorColor || style.bodyText}; opacity: 0.6; font-weight: 700; margin-top: 0; margin-bottom: 0;">${escapeHtml(header.author)}</p>` : ''}
      ${
        header.tags && header.tags.length > 0
          ? `<div style="display: flex; gap: 0.5rem; justify-content: ${headerTagsJustify}; margin-top: 1rem; flex-wrap: wrap;">${header.tags
              .map(
                (tag) =>
                  `<span style="background: ${style.highlightBg}; color: ${style.highlightText}; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 700;">${escapeHtml(tag)}</span>`
              )
              .join('')}</div>`
          : ''
      }
    </div>
  `
      : '';

  // Generate chapters HTML
  const chaptersHTML =
    chapters && chapters.length > 0
      ? chapters.map((chapter, idx) => generateChapterHTML(chapter, idx, style, collapseMode)).join('\n')
      : '';

  // Add box-sizing: border-box and max-width: 100% to all containers to prevent overflow
  const containerHTML = `
<div style="box-sizing: border-box; max-width: 100%; font-family: ${style.fontFamily}; background: ${style.transparentOuter ? 'transparent' : style.outerBg}; padding: ${layout.outerPadding};">
  <div style="box-sizing: border-box; width: 100%; max-width: ${layout.maxWidth}; margin: 0 auto; background: ${style.cardBg}; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: ${layout.innerPadding};">
    ${header.heroImageLayout === 'above' && header.heroImageUrl ? heroImageHTML : ''}
    ${header.heroImageLayout === 'background' && header.heroImageUrl ? heroImageHTML : headerHTML}
    ${header.heroImageLayout !== 'above' && header.heroImageLayout !== 'background' && !header.heroImageUrl ? headerHTML : ''}
    <div style="margin-top: 2rem;">
      ${chaptersHTML}
    </div>
    ${header.heroImageLayout === 'below' && header.heroImageUrl ? heroImageHTML : ''}
  </div>
</div>`;

  return containerHTML.trim();
}

function generateChapterHTML(chapter: Chapter, index: number, style: any, collapseMode: CollapseMode): string {
  const openAttr = collapseMode === 'all-expanded' ? 'open' : '';

  const mainContentHTML = chapter.content
    ? chapter.content
        .split(/\n\n+/)
        .map((para) => {
          const processedText = processDialogue(escapeHtml(para), style.highlightBg, style.highlightText);
          return `<p style="margin-bottom: 0.7rem; margin-top: 0; line-height: ${style.lineHeight}; letter-spacing: ${style.letterSpacing}px; color: ${style.bodyText};">${processedText}</p>`;
        })
        .join('\n')
    : '';

  const sectionsHTML =
    chapter.sections && chapter.sections.length > 0
      ? `<div style="margin-top: 0.3rem;">${chapter.sections
          .map((section, sIdx) => generateSectionHTML(section, index, sIdx, style, collapseMode))
          .join('\n')}</div>`
      : '';

  return `
    <details ${openAttr} style="margin-bottom: 0.5rem; background-color: ${style.chapterBg || style.cardBg}; border: 1px solid ${style.chapterBorder || '#e5e7eb'}; border-radius: 4px; overflow: hidden; font-family: ${style.fontFamily};">
      <summary style="background-color: ${style.chapterTitleBg || '#f3f4f6'}; color: ${style.chapterTitleText || style.bodyText}; padding: 0.4rem 0.6rem; cursor: pointer; font-weight: 600; font-size: 0.85rem; font-family: ${style.fontFamily}; user-select: none;">
        ${escapeHtml(chapter.title)}
      </summary>
      <div style="padding: 0.6rem; font-size: ${style.fontSize}px; font-family: ${style.fontFamily};">
        ${mainContentHTML}
        ${sectionsHTML}
      </div>
    </details>
  `;
}

function generateSectionHTML(section: Section, _chapterIdx: number, _sectionIdx: number, style: any, collapseMode: CollapseMode): string {
  const openAttr = collapseMode === 'all-expanded' ? 'open' : '';

  const sectionContentHTML = section.content
    ? section.content
        .split(/\n\n+/)
        .map((para) => {
          const processedText = processDialogue(escapeHtml(para), style.highlightBg, style.highlightText);
          return `<p style="margin-bottom: 0.5rem; margin-top: 0; line-height: ${style.lineHeight}; letter-spacing: ${style.letterSpacing}px; color: ${style.bodyText};">${processedText}</p>`;
        })
        .join('\n')
    : '';

  return `
    <details ${openAttr} style="margin-bottom: 0.3rem; border-left: 2px solid ${style.highlightBg}; padding-left: 0.5rem; font-family: ${style.fontFamily};">
      <summary style="cursor: pointer; margin-bottom: 0.3rem; font-weight: 600; font-size: 0.8rem; font-family: ${style.fontFamily}; color: ${style.bodyText}; user-select: none;">
        ${escapeHtml(section.subtitle)}
      </summary>
      <div style="font-size: ${style.fontSize}px; font-family: ${style.fontFamily};">
        ${sectionContentHTML}
      </div>
    </details>
  `;
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
  return text
    .replace(
      /"([^"]+)"/g,
      `<span style="background: ${highlightBg}; color: ${highlightText}; padding: 2px 6px; border-radius: 4px;">"$1"</span>`
    )
    .replace(
      /“([^”]+)”/g,
      `<span style="background: ${highlightBg}; color: ${highlightText}; padding: 2px 6px; border-radius: 4px;">“$1”</span>`
    )
    .replace(
      /「([^」]+)」/g,
      `<span style="background: ${highlightBg}; color: ${highlightText}; padding: 2px 6px; border-radius: 4px;">「$1」</span>`
    );
}

export function copyHTMLToClipboard(html: string): Promise<void> {
  // 게시판 붙여넣기에서 스크립트가 제거되는 경우가 많아, 여기서는 순수 HTML만 복사합니다.
  return navigator.clipboard.writeText(html);
}

export function downloadHTML(html: string, filename: string): void {
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
