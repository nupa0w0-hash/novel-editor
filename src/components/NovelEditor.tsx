import { useState, useEffect } from 'react';
import { NovelEpisode, NovelStyle, Chapter, StylePreset } from '../types';
import { NovelPreview } from './NovelPreview';
import { generateHTML, copyHTMLToClipboard, downloadHTML } from '../utils/htmlExporter';
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
      fontSize: 14.2,
      lineHeight: 1.7,
      letterSpacing: -0.5
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
      fontSize: 14.2,
      lineHeight: 1.8,
      letterSpacing: -0.3
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
      fontSize: 14.5,
      lineHeight: 1.8,
      letterSpacing: -0.4
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
      fontSize: 14.2,
      lineHeight: 1.75,
      letterSpacing: -0.3
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
      fontSize: 14.5,
      lineHeight: 1.8,
      letterSpacing: -0.5
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
      fontSize: 14.2,
      lineHeight: 1.8,
      letterSpacing: -0.4
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
      fontSize: 14.2,
      lineHeight: 1.75,
      letterSpacing: -0.3
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
      fontSize: 14.5,
      lineHeight: 1.8,
      letterSpacing: -0.5
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
      fontSize: 14.2,
      lineHeight: 1.75,
      letterSpacing: -0.2
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
      fontSize: 14.2,
      lineHeight: 1.8,
      letterSpacing: -0.4
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
      fontSize: 14.5,
      lineHeight: 1.8,
      letterSpacing: -0.5
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
      fontSize: 14.2,
      lineHeight: 1.75,
      letterSpacing: -0.3
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
      fontSize: 14.5,
      lineHeight: 1.8,
      letterSpacing: -0.5
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
      fontSize: 14.2,
      lineHeight: 1.7,
      letterSpacing: -0.5
    }
  },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const NovelEditor = () => {
  const [activeTab, setActiveTab] = useState<'INPUTS' | 'STYLES'>('INPUTS');
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
  
  // Chapter system
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: generateId(), title: '챕터 1', content: '', isCollapsed: false }
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
    // Combine all chapters into blocks
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

  // Chapter functions
  const addChapter = () => {
    const newChapter: Chapter = {
      id: generateId(),
      title: `챕터 ${chapters.length + 1}`,
      content: '',
      isCollapsed: false
    };
    setChapters([...chapters, newChapter]);
  };

  const updateChapter = (id: string, field: keyof Chapter, value: string | boolean) => {
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

  // Preset functions
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
      const html = generateHTML(previewEpisode);
      await copyHTMLToClipboard(html);
      alert('HTML이 복사되었습니다! 아카라이브 게시판에 바로 붙여넣기 하세요.');
    } catch (err) {
      console.error('Copy failed', err);
      alert('복사에 실패했습니다');
    }
  };

  const handleDownloadHTML = () => {
    if (!previewEpisode) return;
    const html = generateHTML(previewEpisode);
    downloadHTML(html, title || 'novel');
  };

  const clearDraft = () => {
    if (window.confirm('모든 내용을 삭제하시겠습니까?')) {
      setTitle('');
      setAuthor('');
      setTags('');
      setSubtitle('');
      setHeroImageUrl('');
      setChapters([{ id: generateId(), title: '챕터 1', content: '', isCollapsed: false }]);
      localStorage.removeItem('novel_draft');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      <div className="w-1/2 min-w-[400px] flex flex-col border-r border-gray-200 bg-white shadow-xl z-10">
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-white sticky top-0 z-20">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('INPUTS')}
              className={`text-sm font-bold px-2 py-4 border-b-2 transition-colors ${activeTab === 'INPUTS' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
            >
              내용
            </button>
            <button
              onClick={() => setActiveTab('STYLES')}
              className={`text-sm font-bold px-2 py-4 border-b-2 transition-colors ${activeTab === 'STYLES' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
            >
              스타일
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={clearDraft} className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-2">
              초기화
            </button>
            <button onClick={handleCopyHTML} className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              HTML 복사
            </button>
            <button onClick={handleDownloadHTML} className="text-xs font-bold bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
              다운로드
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'INPUTS' && (
            <div className="p-6 space-y-6">
              {/* Meta Info */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">기본 정보</label>
                <div className="space-y-3">
                  <input
                    className="w-full text-2xl font-black placeholder-gray-200 outline-none border-b border-transparent focus:border-gray-200 pb-2 transition-colors"
                    placeholder="제목"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                  />
                  <input
                    className="w-full text-sm font-serif placeholder-gray-300 outline-none border-b border-transparent focus:border-gray-200 pb-1"
                    placeholder="부제목 (선택)"
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                  />
                  <div className="flex gap-4">
                    <input
                      className="flex-1 text-sm font-bold placeholder-gray-300 outline-none border-b border-transparent focus:border-gray-200 pb-1"
                      placeholder="저자명"
                      value={author}
                      onChange={e => setAuthor(e.target.value)}
                    />
                    <input
                      className="flex-1 text-sm font-bold placeholder-gray-300 outline-none border-b border-transparent focus:border-gray-200 pb-1"
                      placeholder="태그 (쉼표로 구분)"
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Hero Image */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">히어로 이미지</label>
                <div className="space-y-3">
                  <input
                    className="w-full text-sm placeholder-gray-300 outline-none border border-gray-200 rounded px-3 py-2 focus:border-black"
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
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">레이아웃</label>
                        <div className="flex gap-2">
                          {(['background', 'above', 'below'] as const).map(layout => (
                            <button
                              key={layout}
                              onClick={() => setHeroImageLayout(layout)}
                              className={`text-[10px] px-2 py-1 rounded font-bold border uppercase ${heroImageLayout === layout ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
                            >
                              {layout === 'background' ? '배경' : layout === 'above' ? '상단' : '하단'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">비율</label>
                        <div className="flex gap-2 flex-wrap">
                          {(['21:9', '16:9', '4:3', '1:1', '3:4', '9:16', 'original'] as const).map(ratio => (
                            <button
                              key={ratio}
                              onClick={() => setHeroImageAspectRatio(ratio)}
                              className={`text-[10px] px-2 py-1 rounded font-bold border ${heroImageAspectRatio === ratio ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
                            >
                              {ratio === 'original' ? '원본' : ratio}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">제목 위치</label>
                    <div className="flex gap-2">
                      {(['center', 'tl', 'tr', 'bl', 'br'] as const).map(pos => (
                        <button
                          key={pos}
                          onClick={() => setTitlePosition(pos)}
                          className={`text-[10px] px-2 py-1 rounded font-bold border uppercase ${titlePosition === pos ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
                        >
                          {pos === 'center' ? '중앙' : pos === 'tl' ? '좌상' : pos === 'tr' ? '우상' : pos === 'bl' ? '좌하' : '우하'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Chapters */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">챕터</label>
                  <div className="flex gap-2">
                    <button onClick={collapseAll} className="text-[10px] text-gray-400 hover:text-gray-600">모두 접기</button>
                    <button onClick={expandAll} className="text-[10px] text-gray-400 hover:text-gray-600">모두 펼치기</button>
                    <button onClick={addChapter} className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                      + 챕터 추가
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Chapter Header */}
                      <div 
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleCollapse(chapter.id)}
                      >
                        <span className="text-gray-400 text-sm">
                          {chapter.isCollapsed ? '▶' : '▼'}
                        </span>
                        <input
                          className="flex-1 text-sm font-bold bg-transparent outline-none"
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
                            className="text-[10px] px-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveChapter(chapter.id, 'down')}
                            disabled={index === chapters.length - 1}
                            className="text-[10px] px-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
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

                      {/* Chapter Content */}
                      {!chapter.isCollapsed && (
                        <div className="p-3">
                          <textarea
                            className="w-full min-h-[200px] resize-none outline-none text-sm leading-relaxed text-gray-700 placeholder-gray-300"
                            placeholder="내용을 입력하세요... (엔터 두 번 = 새 문단, 따옴표 = 대화)"
                            value={chapter.content}
                            onChange={e => updateChapter(chapter.id, 'content', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'STYLES' && (
            <div className="p-6 space-y-6">
              {/* Presets */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">프리셋</label>
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
                      className="border border-gray-200 rounded-full px-3 py-1.5 hover:border-black transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: preset.style.cardBg }}></div>
                      <span className="text-xs font-bold text-gray-600 group-hover:text-black">{preset.name}</span>
                    </button>
                  ))}
                  {customPresets.map((preset, idx) => (
                    <div key={idx} className="relative group">
                      <button
                        onClick={() => setStyle(preset.style)}
                        className="border border-purple-200 bg-purple-50 rounded-full px-3 py-1.5 hover:border-purple-400 transition-colors flex items-center gap-2"
                      >
                        <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: preset.style.cardBg }}></div>
                        <span className="text-xs font-bold text-purple-600">{preset.name}</span>
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
                    className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-black flex-1"
                    placeholder="새 프리셋 이름"
                    value={presetName}
                    onChange={e => setPresetName(e.target.value)}
                  />
                  <button onClick={saveCustomPreset} className="text-xs font-bold bg-gray-900 text-white px-3 py-1 rounded">저장</button>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Typography */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">타이포그래피</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">폰트</label>
                    <div className="flex flex-wrap gap-2">
                      {FONT_PRESETS.map(font => (
                        <button
                          key={font.name}
                          onClick={() => setStyle({ ...style, fontFamily: font.value })}
                          className={`px-3 py-2 rounded border text-xs font-bold transition-all ${style.fontFamily === font.value ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">크기 (px)</label>
                      <input
                        type="number" step="0.1" min="10" max="30"
                        className="w-full text-xs p-2 border rounded bg-white focus:border-black outline-none"
                        value={style.fontSize}
                        onChange={e => setStyle({...style, fontSize: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">줄 높이</label>
                      <input
                        type="number" step="0.1" min="1.0" max="3.0"
                        className="w-full text-xs p-2 border rounded bg-white focus:border-black outline-none"
                        value={style.lineHeight}
                        onChange={e => setStyle({...style, lineHeight: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">자간 (px)</label>
                      <input
                        type="number" step="0.1" min="-2" max="5"
                        className="w-full text-xs p-2 border rounded bg-white focus:border-black outline-none"
                        value={style.letterSpacing}
                        onChange={e => setStyle({...style, letterSpacing: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Header Colors */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">헤더 색상</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">제목</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={titleColor || '#000000'} onChange={e => setTitleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <button onClick={() => setTitleColor('')} className="text-[10px] text-gray-400 underline">초기화</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">부제목</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={subtitleColor || '#000000'} onChange={e => setSubtitleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <button onClick={() => setSubtitleColor('')} className="text-[10px] text-gray-400 underline">초기화</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">저자</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={authorColor || '#000000'} onChange={e => setAuthorColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <button onClick={() => setAuthorColor('')} className="text-[10px] text-gray-400 underline">초기화</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Colors */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">배경 색상</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">외부 배경</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={style.outerBg} onChange={e => setStyle({...style, outerBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                      <span className="text-xs font-mono text-gray-400">{style.outerBg}</span>
                    </div>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={style.transparentOuter}
                        onChange={e => setStyle({...style, transparentOuter: e.target.checked})}
                        className="rounded border-gray-300"
                      />
                      <span className="text-xs font-bold text-gray-500">투명</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">카드 배경</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={style.cardBg} onChange={e => setStyle({...style, cardBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                      <span className="text-xs font-mono text-gray-400">{style.cardBg}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">본문 텍스트</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={style.bodyText} onChange={e => setStyle({...style, bodyText: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                      <span className="text-xs font-mono text-gray-400">{style.bodyText}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Dialogue Highlight */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">대화 하이라이트</label>
                <div className="flex gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">배경</label>
                    <input type="color" value={style.highlightBg} onChange={e => setStyle({...style, highlightBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">텍스트</label>
                    <input type="color" value={style.highlightText} onChange={e => setStyle({...style, highlightText: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-sm">
                      미리보기 <span style={{ backgroundColor: style.highlightBg, color: style.highlightText, padding: '2px 4px', borderRadius: '4px' }}>"대화"</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-1/2 h-full bg-gray-200 overflow-hidden flex flex-col relative">
        <div className="absolute top-4 right-4 z-10 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
          실시간 미리보기
        </div>
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          {previewEpisode && <NovelPreview episode={previewEpisode} />}
        </div>
      </div>
    </div>
  );
};