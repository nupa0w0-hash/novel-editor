export interface NovelStyle {
  fontFamily: string;
  outerBg: string;
  transparentOuter: boolean;
  cardBg: string;
  bodyText: string;
  highlightBg: string;
  highlightText: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface NovelHeader {
  author: string;
  subtitle?: string;
  tags?: string[];
  heroImageUrl?: string;
  titlePosition?: 'center' | 'tl' | 'tr' | 'bl' | 'br';
  heroImageLayout?: 'background' | 'above' | 'below';
  heroImageAspectRatio?: '21:9' | '16:9' | '4:3' | '1:1' | '3:4' | '9:16' | 'original';
  titleColor?: string;
  subtitleColor?: string;
  authorColor?: string;
}

export interface EpisodeBlock {
  type: 'paragraph';
  text: string;
}

export interface NovelEpisode {
  title: string;
  header: NovelHeader;
  blocks: EpisodeBlock[];
  style: NovelStyle;
}