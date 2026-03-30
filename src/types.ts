export interface ViralContent {
  hook: string;
  videoIdea: string;
  script: string;
  tone: string;
  niche: string;
  lang?: string;
}

export type Tone = 'controversial' | 'educational' | 'storytelling' | 'humorous' | 'inspirational';
