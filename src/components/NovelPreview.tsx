import React from 'react';
import { NovelEpisode } from '../types';

interface NovelPreviewProps {
  episode: NovelEpisode;
}

export const NovelPreview: React.FC<NovelPreviewProps> = ({ episode }) => {
  const { title, header, blocks, style } = episode;

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

    // Match Korean quotes, English quotes
    const regex = /(“[^”]+”|「[^」]+」|"[^"]+")/g;
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
          padding: '3rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {header.heroImageLayout === 'above' && renderHeroImage()}
        {renderHeader()}
        {header.heroImageLayout === 'background' && renderHeroImage()}

        <div
          style={{
            fontSize: `${style.fontSize}px`,
            color: style.bodyText,
            lineHeight: style.lineHeight,
            letterSpacing: `${style.letterSpacing}px`,
          }}
        >
          {blocks.map((block, idx) => (
            <p key={idx} style={{ marginBottom: '1.5rem' }}>
              {processDialogue(block.text)}
            </p>
          ))}
        </div>

        {header.heroImageLayout === 'below' && renderHeroImage()}
      </div>
    </div>
  );
};