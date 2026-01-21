export interface NovelHeader {
  author?: string;
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

export interface NovelBlock {
  type: 'paragraph' | 'image';
  text?: string;
  src?: string;
  caption?: string;
}

export interface Section {
  id: string;
  subtitle: string;
  content: string;
  isCollapsed: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  isCollapsed: boolean;
  sections: Section[];
}

export interface NovelStyle {
  fontFamily: string;
  outerBg: string;
  transparentOuter: boolean;
  cardBg: string;
  bodyText: string;
  highlightBg: string;
  highlightText: string;
  thoughtHighlightBg?: string;
  thoughtHighlightText?: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  chapterBg?: string;
  chapterBorder?: string;
  chapterTitleBg?: string;
  chapterTitleText?: string;
}

export interface NovelEpisode {
  title: string;
  header: NovelHeader;
  blocks: NovelBlock[];
  style: NovelStyle;
  chapters?: Chapter[];
}

export interface StylePreset {
  name: string;
  style: NovelStyle;
}

export type ViewMode = 'mobile' | 'desktop';
