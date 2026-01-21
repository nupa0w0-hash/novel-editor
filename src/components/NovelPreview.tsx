import React, { useMemo } from 'react';
import { NovelEpisode, ViewMode } from '../types';
import { generateHTML } from '../utils/htmlExporter';

interface NovelPreviewProps {
  episode: NovelEpisode;
  viewMode?: ViewMode;
}

// Preview should match exported HTML 1:1, but we also need a stable "virtual viewport"
// so desktop/mobile differences remain visible even inside the app's split panel.
export const NovelPreview: React.FC<NovelPreviewProps> = ({ episode, viewMode = 'desktop' }) => {
  const html = useMemo(() => generateHTML(episode, 'all-expanded', viewMode), [episode, viewMode]);

  // Mobile: simulate a typical phone viewport width.
  // Desktop: simulate a wider viewport so max-width differences (e.g., 600px vs 750px) are actually visible.
  const frameWidth = viewMode === 'mobile' ? '430px' : '1100px';

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: frameWidth, maxWidth: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
