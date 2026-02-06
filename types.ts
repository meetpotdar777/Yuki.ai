
export enum AppMode {
  LIVE = 'LIVE',
  CHAT = 'CHAT',
  IMAGE_GEN = 'IMAGE_GEN',
  IMAGE_EDIT = 'IMAGE_EDIT',
  ANALYZE = 'ANALYZE',
  TRANSCRIPT = 'TRANSCRIPT'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  groundingUrls?: { title: string; uri: string }[];
}

export interface ImageResult {
  url: string;
  prompt: string;
}

export type ImageSize = '1K' | '2K' | '4K';

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface TranscriptionItem {
  speaker: 'user' | 'yuki';
  text: string;
}
