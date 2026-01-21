import { useState, useEffect } from 'react';
import { NovelEpisode, NovelStyle, Chapter, Section, StylePreset, ViewMode } from '../types';
import { NovelPreview } from './NovelPreview';
import { generateHTML, copyHTMLToClipboard, downloadHTML, CollapseMode } from '../utils/htmlExporter';
import { exportPresetsToFile, importPresetsFromFile } from '../utils/presetManager';

const FONT_PRESETS = [
  { name: 'Noto Serif KR', value: 'Noto Serif KR, serif' },
  { name: 'Nanum Myeongjo', value: 'Nanum Myeongjo, serif' },
  { name: 'Pretendard', value: 'Pretendard, sans-serif' },
];

const DEFAULT_PRESETS: StylePreset[] = [
  {
    name: 'Paper White',
    style: {
      fontFamily: 'Noto Serif KR, serif',
      outerBg: '#f3f4f6',
      transparentOuter: false,
      cardBg: '#ffffff',
      bodyText: '#1f2937',
      highlightBg: '#e0e7ff',
      highlightText: '#3730a3',
      thoughtHighlightBg: '#fef3c7',
      thoughtHighlightText: '#92400e',
      fontSize: 14.2,
      lineHeight: 1.7,
      letterSpacing: -0.5,
      chapterBg: '#f9fafb',
      chapterBorder: '#e5e7eb',
      chapterTitleBg: '#f3f4f6',
      chapterTitleText: '#111827'
    }
  },
  {
    name: 'Midnight Blue',
    style: {
      fontFamily: 'Noto Serif KR, serif',
      outerBg: '#0f172a',
      transparentOuter: false,
      cardBg: '#1e293b',
      bodyText: '#e2e8f0',
      highlightBg: '#334155',
      highlightText: '#38bdf8',
      thoughtHighlightBg: '#312e81',
      thoughtHighlightText: '#c7d2fe',
      fontSize: 14.2,
      lineHeight: 1.8,
      letterSpacing: -0.3,
      chapterBg: '#1e293b',
      chapterBorder: '#334155',
      chapterTitleBg: '#334155',
      chapterTitleText: '#38bdf8'
    }
  },
  {
    name: 'Soft Lavender',
    style: {
      fontFamily: 'Nanum Myeongjo, serif',
      outerBg: '#faf5ff',
      transparentOuter: false,
      cardBg: '#ffffff',
      bodyText: '#4c1d95',
      highlightBg: '#f3e8ff',
      highlightText: '#7c3aed',
      thoughtHighlightBg: '#fef3c7',
      thoughtHighlightText: '#a16207',
      fontSize: 14.5,
      lineHeight: 1.8,
      letterSpacing: -0.4,
      chapterBg: '#faf5ff',
      chapterBorder: '#e9d5ff',
      chapterTitleBg: '#f3e8ff',
      chapterTitleText: '#6b21a8'
    }
  },
  {
    name: 'Ocean Breeze',
    style: {
      fontFamily: 'Pretendard, sans-serif',
      outerBg: '#ecfeff',
      transparentOuter: false,
      cardBg: '#ffffff',
      bodyText: '#164e63',
      highlightBg: '#cffafe',
      highlightText: '#0891b2',
      thoughtHighlightBg: '#e0f2fe',
      thoughtHighlightText: '#0369a1',
      fontSize: 14.2,
      lineHeight: 1.75,
      letterSpacing: -0.3,
      chapterBg: '#ecfeff',
      chapterBorder: '#a5f3fc',
      chapterTitleBg: '#cffafe',
      chapterTitleText: '#0e7490'
    }
  },
  {
    name: 'Warm Coffee',
    style: {
      fontFamily: 'Noto Serif KR, serif',
      outerBg: '#fef3c7',
      transparentOuter: false,
      cardBg: '#fffbeb',
      bodyText: '#78350f',
      highlightBg: '#fed7aa',
      highlightText: '#92400e',
      thoughtHighlightBg: '#e0e7ff',
      thoughtHighlightText: '#3730a3',
      fontSize: 14.5,
      lineHeight: 1.8,
      letterSpacing: -0.5,
      chapterBg: '#fffbeb',
      chapterBorder: '#fed7aa',
      chapterTitleBg: '#fef3c7',
      chapterTitleText: '#78350f'
    }
  },
  {
    name: 'Emerald Garden',
    style: {
      fontFamily: 'Nanum Myeongjo, serif',
      outerBg: '#f0fdf4',
      transparentOuter: false,
      cardBg: '#ffffff',
      bodyText: '#14532d',
      highlightBg: '#d1fae5',
      highlightText: '#047857',
      thoughtHighlightBg: '#fce7f3',
      thoughtHighlightText: '#be185d',
      fontSize: 14.2,
      lineHeight: 1.8,
      letterSpacing: -0.4,
      chapterBg: '#f0fdf4',
      chapterBorder: '#a7f3d0',
      chapterTitleBg: '#d1fae5',
      chapterTitleText: '#065f46'
    }
  },
  {
    name: 'Sunset Glow',
    style: {
      fontFamily: 'Pretendard, sans-serif',
      outerBg: '#fff7ed',
      transparentOuter: false,
      cardBg: '#ffffff',
      bodyText: '#7c2d12',
      highlightBg: '#fed7aa',
      highlightText: '#ea580c',
      thoughtHighlightBg: '#dbeafe',
      thoughtHighlightText: '#1d4ed8',
      fontSize: 14.2,
      lineHeight: 1.75,
      letterSpacing: -0.3,
      chapterBg: '#fff7ed',
      chapterBorder: '#fed7aa',
      chapterTitleBg: '#ffedd5',
      chapterTitleText: '#9a3412'
    }
  },
  {
    name: 'Cherry Blossom',
    style: {
      fontFamily: 'Noto Serif KR, serif',
      outerBg: '#fdf2f8',
      transparentOuter: false,
      cardBg: '#ffffff',
      bodyText: '#831843',
      highlightBg: '#fce7f3',
      highlightText: '#be185d',
      thoughtHighlightBg: '#d1fae5',
      thoughtHighlightText: '#047857',
      fontSize: 14.5,
      lineHeight: 1.8,
      letterSpacing: -0.5,
      chapterBg: '#fdf2f8',
      chapterBorder: '#fbcfe8',
      chapterTitleBg: '#fce7f3',
      chapterTitleText: '#9f1239'
    }
  },
  {
    name: 'Deep Purple',
    style: {
      fontFamily: 'Pretendard, sans-serif',
      outerBg: '#1e1b4b',
      transparentOuter: false,
      cardBg: '#312e81',
      bodyText: '#e0e7ff',
      highlightBg: '#4338ca',
      highlightText: '#a5b4fc',
      thoughtHighlightBg: '#374151',
      thoughtHighlightText: '#fbbf24',
      fontSize: 14.2,
      lineHeight: 1.75,
      letterSpacing: -0.2,
      chapterBg: '#312e81',
      chapterBorder: '#4338ca',
      chapterTitleBg: '#4338ca',
      chapterTitleText: '#c7d2fe'
    }
  },
  {
    name: 'Mint Fresh',
    style: {
      fontFamily: 'Nanum Myeongjo, serif',
      outerBg: '#f0fdfa',
      transparentOuter: false,
      cardBg: '#ffffff',
      bodyText: '#134e4a',
      highlightBg: '#ccfbf1',
      highlightText: '#0f766e',
      thoughtHighlightBg: '#dbeafe',
      thoughtHighlightText: '#1d4ed8',
      fontSize: 14.2,
      lineHeight: 1.8,
      letterSpacing: -0.4,
      chapterBg: '#f0fdfa',
      chapterBorder: '#99f6e4',
      chapterTitleBg: '#ccfbf1',
      chapterTitleText: '#115e59'
    }
  },
  {
    name: 'Slate Elegance',
    style: {
      fontFamily: 'Noto Serif KR, serif',
      outerBg: '#f8fafc',
      transparentOuter: false,
      cardBg: '#ffffff',
      bodyText: '#1e293b',
      highlightBg: '#e2e8f0',
      highlightText: '#475569',
      thoughtHighlightBg: '#fce7f3',
      thoughtHighlightText: '#be185d',
      fontSize: 14.5,
      lineHeight: 1.8,
      letterSpacing: -0.5,
      chapterBg: '#f8fafc',
      chapterBorder: '#cbd5e1',
      chapterTitleBg: '#e2e8f0',
      chapterTitleText: '#334155'
    }
  },
  {
    name: 'Golden Hour',
    style: {
      fontFamily: 'Pretendard, sans-serif',
      outerBg: '#fffbeb',
      transparentOuter: false,
      cardBg: '#fefce8',
      bodyText: '#713f12',
      highlightBg: '#fef3c7',
      highlightText: '#a16207',
      thoughtHighlightBg: '#dbeafe',
      thoughtHighlightText: '#1d4ed8',
      fontSize: 14.2,
      lineHeight: 1.75,
      letterSpacing: -0.3,
      chapterBg: '#fefce8',
      chapterBorder: '#fef08a',
      chapterTitleBg: '#fef3c7',
      chapterTitleText: '#854d0e'
    }
  },
  {
    name: 'Royal Indigo',
    style: {
      fontFamily: 'Noto Serif KR, serif',
      outerBg: '#f0f9ff',
      transparentOuter: false,
      cardBg: '#ffffff',
      bodyText: '#1e3a8a',
      highlightBg: '#dbeafe',
      highlightText: '#1d4ed8',
      thoughtHighlightBg: '#fef3c7',
      thoughtHighlightText: '#a16207',
      fontSize: 14.5,
      lineHeight: 1.8,
      letterSpacing: -0.5,
      chapterBg: '#eff6ff',
      chapterBorder: '#bfdbfe',
      chapterTitleBg: '#dbeafe',
      chapterTitleText: '#1e40af'
    }
  },
  {
    name: 'Dark Mode',
    style: {
      fontFamily: 'Pretendard, sans-serif',
      outerBg: '#111827',
      transparentOuter: false,
      cardBg: '#1f2937',
      bodyText: '#e5e7eb',
      highlightBg: '#374151',
      highlightText: '#fbbf24',
      thoughtHighlightBg: '#312e81',
      thoughtHighlightText: '#c7d2fe',
      fontSize: 14.2,
      lineHeight: 1.7,
      letterSpacing: -0.5,
      chapterBg: '#1f2937',
      chapterBorder: '#374151',
      chapterTitleBg: '#374151',
      chapterTitleText: '#fbbf24'
    }
  },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const NovelEditor = () => {
  const [activeTab, setActiveTab] = useState<'INPUTS' | 'STYLES'>('INPUTS');
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');

  // UI dark mode (editor only; preview excluded)
  const [uiTheme, setUiTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('novel_ui_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('novel_ui_theme', uiTheme);
  }, [uiTheme]);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [titlePosition, setTitlePosition] = useState<'center' | 'tl' | 'tr' | 'bl' | 'br'>('center');
  const [heroImageLayout, setHeroImageLayout] = useState<'background' | 'above' | 'below'>('background');
  const [heroImageAspectRatio, setHeroImageAspectRatio] = useState<'21:9' | '16:9' | '4:3' | '1:1' | '3:4' | '9:16' | 'original'>('16:9');
  const [titleColor, setTitleColor] = useState('');
  const [subtitleColor, setSubtitleColor] = useState('');
  const [authorColor, setAuthorColor] = useState('');
  const [style, setStyle] = useState<NovelStyle>(DEFAULT_PRESETS[0].style);
  const [customPresets, setCustomPresets] = useState<StylePreset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [previewEpisode, setPreviewEpisode] = useState<NovelEpisode | null>(null);

  // Export options
  const [exportCollapsed, setExportCollapsed] = useState(false);
  const exportMode: CollapseMode = exportCollapsed ? 'all-collapsed' : 'all-expanded';

  // Chapter system
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: generateId(), title: '챕터 1', content: '', isCollapsed: false, sections: [] }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('novel_custom_presets');
    if (saved) {
      try {
        setCustomPresets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load presets', e);
      }
    }

    const draft = localStorage.getItem('novel_draft');
    if (draft) {
      try {
        const data = JSON.parse(draft);
        setTitle(data.title || '');
        setAuthor(data.author || '');
        setTags(data.tags || '');
        setSubtitle(data.subtitle || '');
        if (data.chapters && data.chapters.length > 0) {
          setChapters(data.chapters);
        }
        if (data.style) setStyle(data.style);
      } catch (e) {
        console.error('Failed to load draft', e);
      }
    }
  }, []);

  useEffect(() => {
    const allContent = chapters.map(ch => ch.content).join('\n\n');
    const paragraphs = allContent.split(/\n\n+/);
    const blocks = paragraphs.map(p => ({ type: 'paragraph' as const, text: p }));

    const episode: NovelEpisode = {
      title: title || 'Untitled',
      header: {
        author,
        subtitle,
        tags: tags.split(',').map(s => s.trim()).filter(Boolean),
        heroImageUrl,
        titlePosition,
        heroImageLayout,
        heroImageAspectRatio,
        titleColor,
        subtitleColor,
        authorColor,
      },
      blocks,
      style,
      chapters,
    };
    setPreviewEpisode(episode);

    localStorage.setItem('novel_draft', JSON.stringify({
      title,
      author,
      tags,
      subtitle,
      chapters,
      style,
    }));
  }, [title, author, tags, subtitle, heroImageUrl, titlePosition, heroImageLayout, heroImageAspectRatio, chapters, style, titleColor, subtitleColor, authorColor]);

  const addChapter = () => {
    const newChapter: Chapter = {
      id: generateId(),
      title: `챕터 ${chapters.length + 1}`,
      content: '',
      isCollapsed: false,
      sections: []
    };
    setChapters([...chapters, newChapter]);
  };

  const updateChapter = (id: string, field: keyof Chapter, value: any) => {
    setChapters(chapters.map(ch => 
      ch.id === id ? { ...ch, [field]: value } : ch
    ));
  };

  const deleteChapter = (id: string) => {
    if (chapters.length <= 1) {
      alert('최소 1개의 챕터가 필요합니다.');
      return;
    }
    if (window.confirm('이 챕터를 삭제하시겠습니까?')) {
      setChapters(chapters.filter(ch => ch.id !== id));
    }
  };

  const moveChapter = (id: string, direction: 'up' | 'down') => {
    const index = chapters.findIndex(ch => ch.id === id);
    if (direction === 'up' && index > 0) {
      const newChapters = [...chapters];
      [newChapters[index - 1], newChapters[index]] = [newChapters[index], newChapters[index - 1]];
      setChapters(newChapters);
    } else if (direction === 'down' && index < chapters.length - 1) {
      const newChapters = [...chapters];
      [newChapters[index], newChapters[index + 1]] = [newChapters[index + 1], newChapters[index]];
      setChapters(newChapters);
    }
  };

  const toggleCollapse = (id: string) => {
    setChapters(chapters.map(ch => 
      ch.id === id ? { ...ch, isCollapsed: !ch.isCollapsed } : ch
    ));
  };

  const collapseAll = () => {
    setChapters(chapters.map(ch => ({ ...ch, isCollapsed: true })));
  };

  const expandAll = () => {
    setChapters(chapters.map(ch => ({ ...ch, isCollapsed: false })));
  };

  const addSection = (chapterId: string) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        const newSection: Section = {
          id: generateId(),
          subtitle: `소제목 ${ch.sections.length + 1}`,
          content: '',
          isCollapsed: false
        };
        return { ...ch, sections: [...ch.sections, newSection] };
      }
      return ch;
    }));
  };

  const updateSection = (chapterId: string, sectionId: string, field: keyof Section, value: any) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          sections: ch.sections.map(sec => 
            sec.id === sectionId ? { ...sec, [field]: value } : sec
          )
        };
      }
      return ch;
    }));
  };

  const deleteSection = (chapterId: string, sectionId: string) => {
    if (window.confirm('이 소제목을 삭제하시겠습니까?')) {
      setChapters(chapters.map(ch => {
        if (ch.id === chapterId) {
          return { ...ch, sections: ch.sections.filter(sec => sec.id !== sectionId) };
        }
        return ch;
      }));
    }
  };

  const moveSection = (chapterId: string, sectionId: string, direction: 'up' | 'down') => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        const index = ch.sections.findIndex(sec => sec.id === sectionId);
        if (direction === 'up' && index > 0) {
          const newSections = [...ch.sections];
          [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
          return { ...ch, sections: newSections };
        } else if (direction === 'down' && index < ch.sections.length - 1) {
          const newSections = [...ch.sections];
          [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
          return { ...ch, sections: newSections };
        }
      }
      return ch;
    }));
  };

  const toggleSectionCollapse = (chapterId: string, sectionId: string) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          sections: ch.sections.map(sec => 
            sec.id === sectionId ? { ...sec, isCollapsed: !sec.isCollapsed } : sec
          )
        };
      }
      return ch;
    }));
  };

  const saveCustomPreset = () => {
    if (!presetName.trim()) {
      alert('프리셋 이름을 입력하세요.');
      return;
    }
    const newPreset: StylePreset = { name: presetName, style };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    localStorage.setItem('novel_custom_presets', JSON.stringify(updated));
    setPresetName('');
    alert('프리셋이 저장되었습니다!');
  };

  const deleteCustomPreset = (index: number) => {
    if(window.confirm('이 프리셋을 삭제하시겠습니까?')) {
      const updated = customPresets.filter((_, i) => i !== index);
      setCustomPresets(updated);
      localStorage.setItem('novel_custom_presets', JSON.stringify(updated));
    }
  };

  const handleExportPresets = () => {
    if (customPresets.length === 0) {
      alert('내보낼 커스텀 프리셋이 없습니다.');
      return;
    }
    exportPresetsToFile(customPresets);
  };

  const handleImportPresets = async () => {
    try {
      const imported = await importPresetsFromFile();
      const merged = [...customPresets, ...imported];
      setCustomPresets(merged);
      localStorage.setItem('novel_custom_presets', JSON.stringify(merged));
      alert(`${imported.length}개의 프리셋을 불러왔습니다!`);
    } catch (err) {
      alert('프리셋 파일을 불러오는데 실패했습니다.');
    }
  };

  const handleCopyHTML = async () => {
    if (!previewEpisode) return;
    try {
      const html = generateHTML(previewEpisode, exportMode, viewMode);
      await copyHTMLToClipboard(html);
      alert(`HTML이 복사되었습니다! (${exportCollapsed ? '모두 접힘' : '모두 펼침'} / ${viewMode === 'desktop' ? 'PC' : '모바일'})`);
    } catch (err) {
      console.error('Copy failed', err);
      alert('복사에 실패했습니다');
    }
  };

  const handleDownloadHTML = () => {
    if (!previewEpisode) return;
    const html = generateHTML(previewEpisode, exportMode, viewMode);
    downloadHTML(html, title || 'novel');
  };

  const clearDraft = () => {
    if (window.confirm('모든 내용을 삭제하시겠습니까?')) {
      setTitle('');
      setAuthor('');
      setTags('');
      setSubtitle('');
      setHeroImageUrl('');
      setChapters([{ id: generateId(), title: '챕터 1', content: '', isCollapsed: false, sections: [] }]);
      localStorage.removeItem('novel_draft');
    }
  };

  const thoughtBg = style.thoughtHighlightBg ?? style.highlightBg;
  const thoughtText = style.thoughtHighlightText ?? style.highlightText;

  return (
    <div className="flex flex-col md:flex-row w-screen min-h-screen md:h-screen bg-gray-100 overflow-x-hidden md:overflow-hidden">
      {/* Editor panel (scoped dark mode) */}
      <div className={`${uiTheme === 'dark' ? 'dark' : ''} w-full md:w-1/2 md:min-w-[400px] md:h-screen flex flex-col`}>
        <div className="flex flex-col h-full border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl z-10 text-gray-900 dark:text-gray-100">
          <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 flex-shrink-0">
            <div className="flex items-center justify-between gap-2 px-3 py-2 md:px-4 md:py-0 md:h-14">
              <div className="flex gap-2 md:gap-4">
                <button
                  onClick={() => setActiveTab('INPUTS')}
                  className={`text-xs md:text-sm font-bold px-2 py-2 md:py-4 border-b-2 transition-colors ${activeTab === 'INPUTS' ? 'border-black text-black dark:border-white dark:text-white' : 'border-transparent text-gray-400 dark:text-gray-400'}`}
                >
                  내용
                </button>
                <button
                  onClick={() => setActiveTab('STYLES')}
                  className={`text-xs md:text-sm font-bold px-2 py-2 md:py-4 border-b-2 transition-colors ${activeTab === 'STYLES' ? 'border-black text-black dark:border-white dark:text-white' : 'border-transparent text-gray-400 dark:text-gray-400'}`}
                >
                  스타일
                </button>
              </div>

              {/* Primary actions + options (to keep header clean) */}
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={handleCopyHTML}
                  className="text-[11px] md:text-xs font-bold bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  HTML 복사
                </button>

                <button
                  onClick={handleDownloadHTML}
                  className="text-[11px] md:text-xs font-bold bg-black text-white px-3 md:px-4 py-1.5 md:py-2 rounded hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  다운로드
                </button>

                <details className="relative">
                  <summary
                    className="text-[11px] md:text-xs font-bold px-2 md:px-3 py-1.5 md:py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900 cursor-pointer select-none [&::-webkit-details-marker]:hidden"
                    title="옵션"
                  >
                    옵션
                  </summary>

                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-xl p-3 z-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-300">에디터 테마</span>
                        <button
                          onClick={() => setUiTheme(uiTheme === 'dark' ? 'light' : 'dark')}
                          className="text-[11px] font-bold px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
                          title="에디터 UI 다크모드 (미리보기 제외)"
                        >
                          {uiTheme === 'dark' ? '라이트' : '다크'}
                        </button>
                      </div>

                      <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

                      <label className="flex items-center justify-between gap-3 text-[11px] font-bold text-gray-500 dark:text-gray-300 select-none cursor-pointer">
                        <span>모두 접힘 (내보내기)</span>
                        <input
                          type="checkbox"
                          checked={exportCollapsed}
                          onChange={(e) => setExportCollapsed(e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900"
                        />
                      </label>

                      <div>
                        <div className="text-[11px] font-bold text-gray-500 dark:text-gray-300 mb-1">미리보기/내보내기</div>
                        <div className="flex rounded overflow-hidden border border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => setViewMode('desktop')}
                            className={`text-[10px] font-bold px-2 py-1 flex-1 ${viewMode === 'desktop' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900'}`}
                            title="PC (미리보기 + 내보내기)"
                          >
                            PC
                          </button>
                          <button
                            onClick={() => setViewMode('mobile')}
                            className={`text-[10px] font-bold px-2 py-1 flex-1 ${viewMode === 'mobile' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900'}`}
                            title="모바일 (미리보기 + 내보내기)"
                          >
                            모바일
                          </button>
                        </div>
                      </div>

                      <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

                      <button
                        onClick={clearDraft}
                        className="w-full text-left text-[11px] font-bold text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        초기화
                      </button>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'INPUTS' && (
              <div className="p-4 md:p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider dark:text-gray-400">기본 정보</label>
                  <div className="space-y-3">
                    <input
                      className="w-full text-2xl font-black placeholder-gray-200 dark:placeholder-gray-600 outline-none border-b border-transparent focus:border-gray-200 dark:focus:border-gray-700 pb-2 transition-colors bg-transparent text-gray-900 dark:text-gray-100"
                      placeholder="제목"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      autoFocus
                    />
                    <input
                      className="w-full text-sm font-serif placeholder-gray-300 dark:placeholder-gray-600 outline-none border-b border-transparent focus:border-gray-200 dark:focus:border-gray-700 pb-1 bg-transparent text-gray-900 dark:text-gray-100"
                      placeholder="부제목 (선택)"
                      value={subtitle}
                      onChange={e => setSubtitle(e.target.value)}
                    />
                    <div className="flex gap-4">
                      <input
                        className="flex-1 text-sm font-bold placeholder-gray-300 dark:placeholder-gray-600 outline-none border-b border-transparent focus:border-gray-200 dark:focus:border-gray-700 pb-1 bg-transparent text-gray-900 dark:text-gray-100"
                        placeholder="저자명"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                      />
                      <input
                        className="flex-1 text-sm font-bold placeholder-gray-300 dark:placeholder-gray-600 outline-none border-b border-transparent focus:border-gray-200 dark:focus:border-gray-700 pb-1 bg-transparent text-gray-900 dark:text-gray-100"
                        placeholder="태그 (쉼표로 구분)"
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider dark:text-gray-400">히어로 이미지</label>
                  <div className="space-y-3">
                    <input
                      className="w-full text-sm placeholder-gray-300 dark:placeholder-gray-600 outline-none border border-gray-200 dark:border-gray-700 rounded px-3 py-2 focus:border-black dark:focus:border-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder="이미지 URL (https://...)"
                      value={heroImageUrl}
                      onChange={e => setHeroImageUrl(e.target.value)}
                    />
                    {heroImageUrl && (
                      <div className="space-y-3">
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] text-green-600 font-bold">이미지 설정됨</span>
                          <button onClick={() => setHeroImageUrl('')} className="text-[10px] text-red-400 underline">제거</button>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">레이아웃</label>
                          <div className="flex gap-2">
                            {(['background', 'above', 'below'] as const).map(layout => (
                              <button
                                key={layout}
                                onClick={() => setHeroImageLayout(layout)}
                                className={`text-[10px] px-2 py-1 rounded font-bold border uppercase ${heroImageLayout === layout ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white text-gray-400 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-700'}`}
                              >
                                {layout === 'background' ? '배경' : layout === 'above' ? '상단' : '하단'}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">비율</label>
                          <div className="flex gap-2 flex-wrap">
                            {(['21:9', '16:9', '4:3', '1:1', '3:4', '9:16', 'original'] as const).map(ratio => (
                              <button
                                key={ratio}
                                onClick={() => setHeroImageAspectRatio(ratio)}
                                className={`text-[10px] px-2 py-1 rounded font-bold border ${heroImageAspectRatio === ratio ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white text-gray-400 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-700'}`}
                              >
                                {ratio === 'original' ? '원본' : ratio}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">제목 위치</label>
                      <div className="flex gap-2">
                        {(['center', 'tl', 'tr', 'bl', 'br'] as const).map(pos => (
                          <button
                            key={pos}
                            onClick={() => setTitlePosition(pos)}
                            className={`text-[10px] px-2 py-1 rounded font-bold border uppercase ${titlePosition === pos ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white text-gray-400 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-700'}`}
                          >
                            {pos === 'center' ? '중앙' : pos === 'tl' ? '좌상' : pos === 'tr' ? '우상' : pos === 'bl' ? '좌하' : '우하'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-gray-400">챕터</label>
                    <div className="flex gap-2">
                      <button onClick={collapseAll} className="text-[10px] text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">모두 접기</button>
                      <button onClick={expandAll} className="text-[10px] text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">모두 펼치기</button>
                      <button onClick={addChapter} className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                        + 챕터 추가
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {chapters.map((chapter, index) => (
                      <div key={chapter.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-950">
                        <div 
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => toggleCollapse(chapter.id)}
                        >
                          <span className="text-gray-400 text-sm">
                            {chapter.isCollapsed ? '▶' : '▼'}
                          </span>
                          <input
                            className="flex-1 text-sm font-bold bg-transparent outline-none text-gray-900 dark:text-gray-100"
                            value={chapter.title}
                            onChange={e => updateChapter(chapter.id, 'title', e.target.value)}
                            onClick={e => e.stopPropagation()}
                            placeholder="챕터 제목"
                          />
                          <span className="text-[10px] text-gray-400">
                            {chapter.content.length}자
                          </span>
                          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => moveChapter(chapter.id, 'up')}
                              disabled={index === 0}
                              className="text-[10px] px-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveChapter(chapter.id, 'down')}
                              disabled={index === chapters.length - 1}
                              className="text-[10px] px-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => deleteChapter(chapter.id)}
                              className="text-[10px] px-1 text-red-400 hover:text-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {!chapter.isCollapsed && (
                          <div className="p-3 space-y-3">
                            <div>
                              <textarea
                                className="w-full min-h-[150px] resize-none outline-none text-sm leading-relaxed text-gray-700 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 bg-transparent"
                                placeholder="메인 내용을 입력하세요... (엔터 두 번 = 새 문단, 따옴표 = 대화)"
                                value={chapter.content}
                                onChange={e => updateChapter(chapter.id, 'content', e.target.value)}
                              />
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase">소제목</label>
                                <button 
                                  onClick={() => addSection(chapter.id)}
                                  className="text-[10px] bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                >
                                  + 소제목 추가
                                </button>
                              </div>

                              {chapter.sections.length > 0 && (
                                <div className="space-y-2">
                                  {chapter.sections.map((section, sIndex) => (
                                    <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded overflow-hidden bg-white dark:bg-gray-950">
                                      <div 
                                        className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                        onClick={() => toggleSectionCollapse(chapter.id, section.id)}
                                      >
                                        <span className="text-gray-400 text-xs">
                                          {section.isCollapsed ? '▶' : '▼'}
                                        </span>
                                        <input
                                          className="flex-1 text-xs font-semibold bg-transparent outline-none text-gray-900 dark:text-gray-100"
                                          value={section.subtitle}
                                          onChange={e => updateSection(chapter.id, section.id, 'subtitle', e.target.value)}
                                          onClick={e => e.stopPropagation()}
                                          placeholder="소제목"
                                        />
                                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                          <button
                                            onClick={() => moveSection(chapter.id, section.id, 'up')}
                                            disabled={sIndex === 0}
                                            className="text-[10px] px-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30"
                                          >
                                            ↑
                                          </button>
                                          <button
                                            onClick={() => moveSection(chapter.id, section.id, 'down')}
                                            disabled={sIndex === chapter.sections.length - 1}
                                            className="text-[10px] px-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30"
                                          >
                                            ↓
                                          </button>
                                          <button
                                            onClick={() => deleteSection(chapter.id, section.id)}
                                            className="text-[10px] px-1 text-red-400 hover:text-red-600"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      </div>

                                      {!section.isCollapsed && (
                                        <div className="p-2">
                                          <textarea
                                            className="w-full min-h-[80px] resize-none outline-none text-xs leading-relaxed text-gray-700 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 bg-transparent"
                                            placeholder="소제목 내용..."
                                            value={section.content}
                                            onChange={e => updateSection(chapter.id, section.id, 'content', e.target.value)}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'STYLES' && (
              <div className="p-4 md:p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-gray-400">프리셋</label>
                    <div className="flex gap-2">
                      <button onClick={handleImportPresets} className="text-[10px] text-blue-500 hover:text-blue-600">불러오기</button>
                      <button onClick={handleExportPresets} className="text-[10px] text-blue-500 hover:text-blue-600">내보내기</button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_PRESETS.map(preset => (
                      <button
                        key={preset.name}
                        onClick={() => setStyle(preset.style)}
                        className="border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 hover:border-black dark:hover:border-gray-400 transition-colors flex items-center gap-2 group bg-white dark:bg-gray-900"
                      >
                        <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: preset.style.cardBg }}></div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">{preset.name}</span>
                      </button>
                    ))}
                    {customPresets.map((preset, idx) => (
                      <div key={idx} className="relative group">
                        <button
                          onClick={() => setStyle(preset.style)}
                          className="border border-purple-200 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-900/20 rounded-full px-3 py-1.5 hover:border-purple-400 transition-colors flex items-center gap-2"
                        >
                          <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: preset.style.cardBg }}></div>
                          <span className="text-xs font-bold text-purple-600 dark:text-purple-200">{preset.name}</span>
                        </button>
                        <button
                          onClick={() => deleteCustomPreset(idx)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <input
                      className="text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1 outline-none focus:border-black dark:focus:border-gray-500 flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600"
                      placeholder="새 프리셋 이름"
                      value={presetName}
                      onChange={e => setPresetName(e.target.value)}
                    />
                    <button onClick={saveCustomPreset} className="text-xs font-bold bg-gray-900 text-white px-3 py-1 rounded dark:bg-white dark:text-black">저장</button>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider dark:text-gray-400">타이포그래피</label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">폰트</label>
                      <div className="flex flex-wrap gap-2">
                        {FONT_PRESETS.map(font => (
                          <button
                            key={font.name}
                            onClick={() => setStyle({ ...style, fontFamily: font.value })}
                            className={`px-3 py-2 rounded border text-xs font-bold transition-all ${style.fontFamily === font.value ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-700 dark:hover:border-gray-500'}`}
                          >
                            {font.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">크기 (px)</label>
                        <input
                          type="number" step="0.1" min="10" max="30"
                          className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-black dark:focus:border-gray-500 outline-none"
                          value={style.fontSize}
                          onChange={e => setStyle({...style, fontSize: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">줄 높이</label>
                        <input
                          type="number" step="0.1" min="1.0" max="3.0"
                          className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-black dark:focus:border-gray-500 outline-none"
                          value={style.lineHeight}
                          onChange={e => setStyle({...style, lineHeight: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">자간 (px)</label>
                        <input
                          type="number" step="0.1" min="-2" max="5"
                          className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-black dark:focus:border-gray-500 outline-none"
                          value={style.letterSpacing}
                          onChange={e => setStyle({...style, letterSpacing: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider dark:text-gray-400">헤더 색상</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">제목</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={titleColor || '#000000'} onChange={e => setTitleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                        <button onClick={() => setTitleColor('')} className="text-[10px] text-gray-400 underline">초기화</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">부제목</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={subtitleColor || '#000000'} onChange={e => setSubtitleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                        <button onClick={() => setSubtitleColor('')} className="text-[10px] text-gray-400 underline">초기화</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">저자</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={authorColor || '#000000'} onChange={e => setAuthorColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                        <button onClick={() => setAuthorColor('')} className="text-[10px] text-gray-400 underline">초기화</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider dark:text-gray-400">배경 색상</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">외부 배경</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={style.outerBg} onChange={e => setStyle({...style, outerBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                        <span className="text-xs font-mono text-gray-400">{style.outerBg}</span>
                      </div>
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={style.transparentOuter}
                          onChange={e => setStyle({...style, transparentOuter: e.target.checked})}
                          className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900"
                        />
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-300">투명</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">카드 배경</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={style.cardBg} onChange={e => setStyle({...style, cardBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                        <span className="text-xs font-mono text-gray-400">{style.cardBg}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">본문 텍스트</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={style.bodyText} onChange={e => setStyle({...style, bodyText: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                        <span className="text-xs font-mono text-gray-400">{style.bodyText}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider dark:text-gray-400">대화 하이라이트</label>
                  <div className="flex gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">배경</label>
                      <input type="color" value={style.highlightBg} onChange={e => setStyle({...style, highlightBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">텍스트</label>
                      <input type="color" value={style.highlightText} onChange={e => setStyle({...style, highlightText: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        미리보기 <span style={{ backgroundColor: style.highlightBg, color: style.highlightText, padding: '2px 4px', borderRadius: '4px' }}>&quot;대화&quot;</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider dark:text-gray-400">생각 하이라이트</label>
                  <div className="flex gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">배경</label>
                      <input type="color" value={thoughtBg} onChange={e => setStyle({...style, thoughtHighlightBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">텍스트</label>
                      <input type="color" value={thoughtText} onChange={e => setStyle({...style, thoughtHighlightText: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        미리보기 <span style={{ backgroundColor: thoughtBg, color: thoughtText, padding: '2px 4px', borderRadius: '4px' }}>'생각'</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => setStyle({ ...style, thoughtHighlightBg: undefined, thoughtHighlightText: undefined })}
                        className="text-[10px] text-gray-400 underline"
                        title="생각 하이라이트를 대화 하이라이트로 되돌립니다"
                      >
                        초기화
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider dark:text-gray-400">챕터 박스 스타일</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">챕터 배경</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={style.chapterBg || style.cardBg} 
                          onChange={e => setStyle({...style, chapterBg: e.target.value})} 
                          className="w-8 h-8 rounded cursor-pointer" 
                        />
                        <span className="text-xs font-mono text-gray-400">{style.chapterBg || style.cardBg}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">챕터 테두리</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={style.chapterBorder || '#e5e7eb'} 
                          onChange={e => setStyle({...style, chapterBorder: e.target.value})} 
                          className="w-8 h-8 rounded cursor-pointer" 
                        />
                        <span className="text-xs font-mono text-gray-400">{style.chapterBorder || '#e5e7eb'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">제목 배경</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={style.chapterTitleBg || '#f3f4f6'} 
                          onChange={e => setStyle({...style, chapterTitleBg: e.target.value})} 
                          className="w-8 h-8 rounded cursor-pointer" 
                        />
                        <span className="text-xs font-mono text-gray-400">{style.chapterTitleBg || '#f3f4f6'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1">제목 텍스트</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={style.chapterTitleText || style.bodyText} 
                          onChange={e => setStyle({...style, chapterTitleText: e.target.value})} 
                          className="w-8 h-8 rounded cursor-pointer" 
                        />
                        <span className="text-xs font-mono text-gray-400">{style.chapterTitleText || style.bodyText}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 rounded-lg border-2" style={{
                    backgroundColor: style.chapterBg || style.cardBg,
                    borderColor: style.chapterBorder || '#e5e7eb'
                  }}>
                    <div className="px-3 py-2 rounded-lg mb-3" style={{
                      backgroundColor: style.chapterTitleBg || '#f3f4f6',
                      color: style.chapterTitleText || style.bodyText
                    }}>
                      <span className="text-sm font-bold">챕터 제목 미리보기</span>
                    </div>
                    <div className="text-xs" style={{ color: style.bodyText }}>
                      챕터 내용이 이렇게 표시됩니다.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview panel (no dark mode) */}
      <div className="w-full md:w-1/2 bg-gray-200 md:h-screen border-t md:border-t-0 overflow-hidden flex flex-col relative min-h-[60vh] md:min-h-0">
        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
          실시간 미리보기
        </div>
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          {previewEpisode && <NovelPreview episode={previewEpisode} viewMode={viewMode} />}
        </div>
      </div>
    </div>
  );
};
