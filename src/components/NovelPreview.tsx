import React, { useState } from 'react';
import { NovelEpisode, Chapter, Section, ViewMode } from '../types';

interface NovelPreviewProps {
  episode: NovelEpisode;
  viewMode?: ViewMode;
}

export const NovelPreview: React.FC<NovelPreviewProps> = ({ episode, viewMode = 'desktop' }) => {
  const { title, header, style, chapters } = episode;
  const [collapsedChapters, setCollapsedChapters] = useState<Set<string>>(new Set());
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const getTitleAlignment = (position: string) => {
    const map: Record<string, { vertical: string; horizontal: string }> = {
      center: { vertical: 'center', horizontal: 'center' },
      tl: { vertical: 'flex-start', horizontal: 'flex-start' },
      tr: { vertical: 'flex-start', horizontal: 'flex-end' },
      bl: { vertical: 'flex-end', horizontal: 'flex-start' },
      br: { vertical: 'flex-end', horizontal: 'flex-end' },
    };
    return map[position] || map.center;
  };

  const processDialogue = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    const regex = /("[^"]+"|「[^」]+」|"[^"]+")/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <span
          key={match.index}
          style={{
            backgroundColor: style.highlightBg,
            color: style.highlightText,
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          {match[0]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const toggleChapter = (id: string) => {
    setCollapsedChapters(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const aspectRatioMap: Record<string, string> = {
    '21:9': '42.857%',
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
    '3:4': '133.333%',
    '9:16': '177.778%',
    'original': 'auto',
  };

  const renderHeroImage = () => {
    if (!header.heroImageUrl) return null;

    const paddingBottom = aspectRatioMap[header.heroImageAspectRatio || '16:9'];

    if (header.heroImageLayout === 'background') {
      const alignment = getTitleAlignment(header.titlePosition || 'center');
      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom,
            backgroundImage: `url(${header.heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: alignment.vertical,
              justifyContent: alignment.horizontal,
              padding: '2rem',
            }}
          >
            <div style={{ textAlign: 'center', color: header.titleColor || '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>{title}</h1>
              {header.subtitle && <p style={{ fontSize: '1.25rem', color: header.subtitleColor || '#fff', marginBottom: '0.5rem' }}>{header.subtitle}</p>}
              {header.author && <p style={{ fontSize: '1rem', color: header.authorColor || '#fff' }}>{header.author}</p>}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            width: '100%',
            paddingBottom,
            backgroundImage: `url(${header.heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: header.heroImageLayout === 'above' ? '2rem' : 0,
            marginTop: header.heroImageLayout === 'below' ? '2rem' : 0,
          }}
        />
      );
    }
  };

  const renderHeader = () => {
    if (header.heroImageLayout === 'background' && header.heroImageUrl) return null;

    return (
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: header.titleColor || style.bodyText }}>
          {title}
        </h1>
        {header.subtitle && (
          <p style={{ fontSize: '1.125rem', color: header.subtitleColor || style.bodyText, opacity: 0.7, marginBottom: '0.5rem' }}>
            {header.subtitle}
          </p>
        )}
        {header.author && (
          <p style={{ fontSize: '0.875rem', color: header.authorColor || style.bodyText, opacity: 0.6, fontWeight: 700 }}>
            {header.author}
          </p>
        )}
        {header.tags && header.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
            {header.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  background: style.highlightBg,
                  color: style.highlightText,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderChapter = (chapter: Chapter) => {
    const isCollapsed = collapsedChapters.has(chapter.id);
    
    return (
      <div
        key={chapter.id}
        style={{
          marginBottom: '0.5rem',
          backgroundColor: style.chapterBg || style.cardBg,
          border: `1px solid ${style.chapterBorder || '#e5e7eb'}`,
          borderRadius: '4px',
          overflow: 'hidden',
          fontFamily: style.fontFamily,
        }}
      >
        {/* Chapter Title */}
        <div
          onClick={() => toggleChapter(chapter.id)}
          style={{
            backgroundColor: style.chapterTitleBg || '#f3f4f6',
            color: style.chapterTitleText || style.bodyText,
            padding: '0.4rem 0.6rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 600,
            fontSize: '0.85rem',
            fontFamily: style.fontFamily,
            userSelect: 'none',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = style.chapterBorder || '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = style.chapterTitleBg || '#f3f4f6';
          }}
        >
          <span style={{ opacity: 0.4, fontSize: '0.65rem' }}>{isCollapsed ? '▶' : '▼'}</span>
          {chapter.title}
        </div>

        {/* Chapter Content */}
        {!isCollapsed && (
          <div style={{ padding: '0.6rem', fontFamily: style.fontFamily }}>
            {/* Main content */}
            {chapter.content && (
              <div
                style={{
                  fontSize: `${style.fontSize}px`,
                  color: style.bodyText,
                  lineHeight: style.lineHeight,
                  letterSpacing: `${style.letterSpacing}px`,
                  fontFamily: style.fontFamily,
                  marginBottom: chapter.sections.length > 0 ? '0.5rem' : 0,
                }}
              >
                {chapter.content.split(/\n\n+/).map((para, idx) => (
                  <p key={idx} style={{ marginBottom: '0.7rem' }}>
                    {processDialogue(para)}
                  </p>
                ))}
              </div>
            )}

            {/* Sections */}
            {chapter.sections.length > 0 && (
              <div style={{ marginTop: '0.3rem' }}>
                {chapter.sections.map(section => renderSection(section))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section: Section) => {
    const isCollapsed = collapsedSections.has(section.id);
    
    return (
      <div
        key={section.id}
        style={{
          marginBottom: '0.3rem',
          borderLeft: `2px solid ${style.highlightBg}`,
          paddingLeft: '0.5rem',
          fontFamily: style.fontFamily,
        }}
      >
        {/* Section Subtitle */}
        <div
          onClick={() => toggleSection(section.id)}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            marginBottom: isCollapsed ? 0 : '0.3rem',
            fontWeight: 600,
            fontSize: '0.8rem',
            fontFamily: style.fontFamily,
            color: style.bodyText,
            userSelect: 'none',
          }}
        >
          <span style={{ opacity: 0.35, fontSize: '0.6rem' }}>{isCollapsed ? '▶' : '▼'}</span>
          {section.subtitle}
        </div>

        {/* Section Content */}
        {!isCollapsed && section.content && (
          <div
            style={{
              fontSize: `${style.fontSize}px`,
              color: style.bodyText,
              lineHeight: style.lineHeight,
              letterSpacing: `${style.letterSpacing}px`,
              fontFamily: style.fontFamily,
            }}
          >
            {section.content.split(/\n\n+/).map((para, idx) => (
              <p key={idx} style={{ marginBottom: '0.5rem' }}>
                {processDialogue(para)}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Calculate padding based on viewMode
  const containerPadding = viewMode === 'mobile' ? '3rem 1.5rem' : '3rem 8rem';

  return (
    <div
      style={{
        fontFamily: style.fontFamily,
        background: style.transparentOuter ? 'transparent' : style.outerBg,
        padding: '2rem',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: style.cardBg,
          padding: containerPadding,
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {header.heroImageLayout === 'above' && renderHeroImage()}
        {renderHeader()}
        {header.heroImageLayout === 'background' && renderHeroImage()}

        {/* Render Chapters */}
        <div style={{ marginTop: '2rem' }}>
          {chapters && chapters.length > 0 && chapters.map(chapter => renderChapter(chapter))}
        </div>

        {header.heroImageLayout === 'below' && renderHeroImage()}
      </div>
    </div>
  );
};