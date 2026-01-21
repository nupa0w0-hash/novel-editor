import React, { useMemo } from 'react';
import { NovelEpisode, ViewMode } from '../types';
import { generateHTML } from '../utils/htmlExporter';

interface NovelPreviewProps {
  episode: NovelEpisode;
  viewMode?: ViewMode;
}

// Preview should match exported HTML 1:1 to avoid layout drift.
// We reuse the same HTML generator used by copy/download.
export const NovelPreview: React.FC<NovelPreviewProps> = ({ episode, viewMode = 'desktop' }) => {
  const html = useMemo(() => generateHTML(episode, 'all-expanded', viewMode), [episode, viewMode]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
