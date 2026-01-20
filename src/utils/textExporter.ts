import { NovelEpisode } from '../types';

export function generatePlainText(episode: NovelEpisode): string {
  const { title, header, blocks } = episode;

  let output = '';

  // Title
  output += `${title}\n`;
  
  // Subtitle
  if (header.subtitle) {
    output += `${header.subtitle}\n`;
  }
  
  // Author
  if (header.author) {
    output += `${header.author}\n`;
  }
  
  // Tags
  if (header.tags && header.tags.length > 0) {
    output += `${header.tags.map(tag => `#${tag}`).join(' ')}\n`;
  }
  
  output += '\n'; // Empty line after header
  
  // Body
  blocks.forEach(block => {
    output += `${block.text}\n\n`;
  });
  
  return output.trim();
}

export function copyPlainTextToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}