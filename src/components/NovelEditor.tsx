import React, { useState, useEffect } from 'react';
import { NovelEpisode, NovelStyle } from '../types';
import { NovelPreview } from './NovelPreview';
import { generateHTML, copyHTMLToClipboard, downloadHTML } from '../utils/htmlExporter';

const FONT_PRESETS = [
  { name: 'Noto Serif KR', value: 'Noto Serif KR, serif' },
  { name: 'Nanum Myeongjo', value: 'Nanum Myeongjo, serif' },
  { name: 'Pretendard', value: 'Pretendard, sans-serif' },
];

const DEFAULT_PRESETS: { name: string, style: NovelStyle }[] = [
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
    name: 'Warm Sepia',
    style: {
      fontFamily: 'Nanum Myeongjo, serif',
      outerBg: '#f5f5f4',
      transparentOuter: false,
      cardBg: '#fffbf0',
      bodyText: '#44403c',
      highlightBg: '#fef3c7',
      highlightText: '#92400e',
      fontSize: 14.2,
      lineHeight: 1.7,
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
  {
    name: 'Rose',
    style: {
      fontFamily: 'Noto Serif KR, serif',
      outerBg: '#fff1f2',
      transparentOuter: false,
      cardBg: '#fff',
      bodyText: '#881337',
      highlightBg: '#ffe4e6',
      highlightText: '#9f1239',
      fontSize: 14.2,
      lineHeight: 1.7,
      letterSpacing: -0.5
    }
  },
  {
    name: 'Forest',
    style: {
      fontFamily: 'Noto Serif KR, serif',
      outerBg: '#f0fdf4',
      transparentOuter: false,
      cardBg: '#fff',
      bodyText: '#14532d',
      highlightBg: '#dcfce7',
      highlightText: '#166534',
      fontSize: 14.2,
      lineHeight: 1.7,
      letterSpacing: -0.5
    }
  },
  {
    name: 'Noir',
    style: {
      fontFamily: 'Pretendard, sans-serif',
      outerBg: '#000000',
      transparentOuter: false,
      cardBg: '#111111',
      bodyText: '#a3a3a3',
      highlightBg: '#262626',
      highlightText: '#d4d4d4',
      fontSize: 14.2,
      lineHeight: 1.7,
      letterSpacing: -0.5
    }
  },
];

export const NovelEditor: React.FC = () => {
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
  const [bodyText, setBodyText] = useState('');
  const [style, setStyle] = useState<NovelStyle>(DEFAULT_PRESETS[0].style);
  const [customPresets, setCustomPresets] = useState<{name: string, style: NovelStyle}[]>([]);
  const [presetName, setPresetName] = useState('');
  const [previewEpisode, setPreviewEpisode] = useState<NovelEpisode | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('novel_custom_presets');
    if (saved) {
      try {
        setCustomPresets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load presets', e);
      }
    }

    // Load draft
    const draft = localStorage.getItem('novel_draft');
    if (draft) {
      try {
        const data = JSON.parse(draft);
        setTitle(data.title || '');
        setAuthor(data.author || '');
        setTags(data.tags || '');
        setSubtitle(data.subtitle || '');
        setBodyText(data.bodyText || '');
        if (data.style) setStyle(data.style);
      } catch (e) {
        console.error('Failed to load draft', e);
      }
    }
  }, []);

  useEffect(() => {
    const paragraphs = bodyText.split(/\n\n+/);
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
    };
    setPreviewEpisode(episode);

    // Auto-save draft
    localStorage.setItem('novel_draft', JSON.stringify({
      title,
      author,
      tags,
      subtitle,
      bodyText,
      style,
    }));
  }, [title, author, tags, subtitle, heroImageUrl, titlePosition, heroImageLayout, heroImageAspectRatio, bodyText, style, titleColor, subtitleColor, authorColor]);

  const saveCustomPreset = () => {
    if (!presetName.trim()) {
      alert('Please enter a preset name.');
      return;
    }
    const newPreset = { name: presetName, style };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    localStorage.setItem('novel_custom_presets', JSON.stringify(updated));
    setPresetName('');
    alert('Preset saved!');
  };

  const deleteCustomPreset = (index: number) => {
    if(window.confirm('Delete this preset?')) {
      const updated = customPresets.filter((_, i) => i !== index);
      setCustomPresets(updated);
      localStorage.setItem('novel_custom_presets', JSON.stringify(updated));
    }
  };

  const handleCopyHTML = async () => {
    if (!previewEpisode) return;
    try {
      const html = generateHTML(previewEpisode);
      await copyHTMLToClipboard(html);
      alert('HTML copied to clipboard!');
    } catch (err) {
      console.error('Copy failed', err);
      alert('Failed to copy HTML');
    }
  };

  const handleDownloadHTML = () => {
    if (!previewEpisode) return;
    const html = generateHTML(previewEpisode);
    downloadHTML(html, title || 'novel');
  };

  const clearDraft = () => {
    if (window.confirm('Clear all content?')) {
      setTitle('');
      setAuthor('');
      setTags('');
      setSubtitle('');
      setBodyText('');
      setHeroImageUrl('');
      localStorage.removeItem('novel_draft');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Left Panel */}
      <div className="w-1/2 min-w-[400px] flex flex-col border-r border-gray-200 bg-white shadow-xl z-10">
        {/* Header */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-white sticky top-0 z-20">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('INPUTS')}
              className={`text-sm font-bold px-2 py-4 border-b-2 transition-colors ${activeTab === 'INPUTS' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
            >
              Inputs
            </button>
            <button
              onClick={() => setActiveTab('STYLES')}
              className={`text-sm font-bold px-2 py-4 border-b-2 transition-colors ${activeTab === 'STYLES' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
            >
              Styles
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={clearDraft} className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-2">
              Clear
            </button>
            <button onClick={handleCopyHTML} className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Copy HTML
            </button>
            <button onClick={handleDownloadHTML} className="text-xs font-bold bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
              Download
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'INPUTS' && (
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Meta Information</label>
                <div className="space-y-3">
                  <input
                    className="w-full text-2xl font-black placeholder-gray-200 outline-none border-b border-transparent focus:border-gray-200 pb-2 transition-colors"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                  />
                  <input
                    className="w-full text-sm font-serif placeholder-gray-300 outline-none border-b border-transparent focus:border-gray-200 pb-1"
                    placeholder="Subtitle (Optional)"
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                  />
                  <div className="flex gap-4">
                    <input
                      className="flex-1 text-sm font-bold placeholder-gray-300 outline-none border-b border-transparent focus:border-gray-200 pb-1"
                      placeholder="Author Name"
                      value={author}
                      onChange={e => setAuthor(e.target.value)}
                    />
                    <input
                      className="flex-1 text-sm font-bold placeholder-gray-300 outline-none border-b border-transparent focus:border-gray-200 pb-1"
                      placeholder="Tags (comma separated)"
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Hero Image & Layout</label>
                <div className="space-y-3">
                  <input
                    className="w-full text-sm placeholder-gray-300 outline-none border border-gray-200 rounded px-3 py-2 focus:border-black"
                    placeholder="Image URL (https://...)"
                    value={heroImageUrl}
                    onChange={e => setHeroImageUrl(e.target.value)}
                  />
                  {heroImageUrl && (
                    <div className="space-y-3">
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-green-600 font-bold">Image Set</span>
                        <button onClick={() => setHeroImageUrl('')} className="text-[10px] text-red-400 underline">Remove</button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Image Layout</label>
                        <div className="flex gap-2">
                          {(['background', 'above', 'below'] as const).map(layout => (
                            <button
                              key={layout}
                              onClick={() => setHeroImageLayout(layout)}
                              className={`text-[10px] px-2 py-1 rounded font-bold border uppercase ${heroImageLayout === layout ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
                            >
                              {layout}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Aspect Ratio</label>
                        <div className="flex gap-2 flex-wrap">
                          {(['21:9', '16:9', '4:3', '1:1', '3:4', '9:16', 'original'] as const).map(ratio => (
                            <button
                              key={ratio}
                              onClick={() => setHeroImageAspectRatio(ratio)}
                              className={`text-[10px] px-2 py-1 rounded font-bold border uppercase ${heroImageAspectRatio === ratio ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
                            >
                              {ratio}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Title Position</label>
                    <div className="flex gap-2">
                      {(['center', 'tl', 'tr', 'bl', 'br'] as const).map(pos => (
                        <button
                          key={pos}
                          onClick={() => setTitlePosition(pos)}
                          className={`text-[10px] px-2 py-1 rounded font-bold border uppercase ${titlePosition === pos ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              <div className="flex-1 flex flex-col min-h-[500px]">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
                  Content Body
                  <span className="ml-2 text-[10px] normal-case opacity-50 font-normal">Double Enter = New Paragraph. Quotes "" = Dialogue.</span>
                </label>
                <textarea
                  className="w-full flex-1 min-h-[60vh] resize-none outline-none text-base leading-relaxed text-gray-700 placeholder-gray-200"
                  placeholder="Start writing your story here..."
                  value={bodyText}
                  onChange={e => setBodyText(e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'STYLES' && (
            <div className="p-8 space-y-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Quick Presets</label>
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
                    className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-black"
                    placeholder="New preset name"
                    value={presetName}
                    onChange={e => setPresetName(e.target.value)}
                  />
                  <button onClick={saveCustomPreset} className="text-xs font-bold bg-gray-900 text-white px-3 py-1 rounded">Save Current</button>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Typography</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Font Family</label>
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
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Size (px)</label>
                      <input
                        type="number" step="0.1" min="10" max="30"
                        className="w-full text-xs p-2 border rounded bg-white focus:border-black outline-none"
                        value={style.fontSize}
                        onChange={e => setStyle({...style, fontSize: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Line Height</label>
                      <input
                        type="number" step="0.1" min="1.0" max="3.0"
                        className="w-full text-xs p-2 border rounded bg-white focus:border-black outline-none"
                        value={style.lineHeight}
                        onChange={e => setStyle({...style, lineHeight: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Letter Spacing (px)</label>
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

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Header Colors (Optional)</label>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Title</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={titleColor || '#000000'} onChange={e => setTitleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <button onClick={() => setTitleColor('')} className="text-[10px] text-gray-400 underline">Reset</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Subtitle</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={subtitleColor || '#000000'} onChange={e => setSubtitleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <button onClick={() => setSubtitleColor('')} className="text-[10px] text-gray-400 underline">Reset</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Author</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={authorColor || '#000000'} onChange={e => setAuthorColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <button onClick={() => setAuthorColor('')} className="text-[10px] text-gray-400 underline">Reset</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Colors & Surfaces</label>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Outer Background</label>
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
                      <span className="text-xs font-bold text-gray-500">Transparent</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Card Background</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={style.cardBg} onChange={e => setStyle({...style, cardBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                      <span className="text-xs font-mono text-gray-400">{style.cardBg}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Body Text</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={style.bodyText} onChange={e => setStyle({...style, bodyText: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                      <span className="text-xs font-mono text-gray-400">{style.bodyText}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Dialogue Highlight</label>
                <div className="flex gap-6 p-4 rounded-lg border border-gray-100 bg-gray-50">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Background</label>
                    <input type="color" value={style.highlightBg} onChange={e => setStyle({...style, highlightBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Text Color</label>
                    <input type="color" value={style.highlightText} onChange={e => setStyle({...style, highlightText: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-sm">
                      Test <span style={{ backgroundColor: style.highlightBg, color: style.highlightText, padding: '2px 4px', borderRadius: '4px' }}>"Dialogue"</span> look.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="w-1/2 h-full bg-gray-200 overflow-hidden flex flex-col relative">
        <div className="absolute top-4 right-4 z-10 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
          LIVE PREVIEW
        </div>
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          {previewEpisode && <NovelPreview episode={previewEpisode} />}
        </div>
      </div>
    </div>
  );
};