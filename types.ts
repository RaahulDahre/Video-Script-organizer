export enum Platform {
  Instagram = 'Instagram',
  WhatsApp = 'WhatsApp',
  YouTube = 'YouTube',
  YouTubeShorts = 'YouTube Shorts',
  Threads = 'Threads',
  X = 'X',
  Telegram = 'Telegram',
}

export type TextBlock = {
  id: string;
  type: 'text';
  data: string;
};

export type MediaBlockData = {
  src: string; // base64 data url
  text: string; // associated text/dialogue
};

export type ImageBlock = {
  id: string;
  type: 'image';
  data: MediaBlockData;
};

export type PdfBlock = {
  id: string;
  type: 'pdf';
  data: MediaBlockData;
};

export type ContentBlock = TextBlock | ImageBlock | PdfBlock;

export interface Script {
  id: string;
  title: string;
  content: ContentBlock[];
  platform: Platform;
  tags: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  color: string;
}

export type ScriptFormData = Omit<Script, 'id' | 'createdAt' | 'updatedAt' | 'color'>;
