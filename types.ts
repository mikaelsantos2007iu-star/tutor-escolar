export interface Message {
  role: 'user' | 'model';
  content: string;
  image?: string; // Base64 string for user uploads
  timestamp: number;
}

export interface Slide {
  title: string;
  subtitle?: string;
  content: string[]; // Bullet points
  imagePrompt: string; // The detailed prompt for the AI to generate the image
  generatedImageBase64?: string; // The actual generated image
}

export interface Presentation {
  topic: string;
  slides: Slide[];
}

// Quiz Types
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
}

// Mind Map Types
export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

// Essay Types
export interface EssayResult {
  score: number;
  feedback: string;
  competencies: {
    name: string;
    score: number;
    comment: string;
  }[];
  correctedVersion: string;
}

// Library/Search Types
export interface SearchResult {
  text: string;
  sources: {
    title: string;
    uri: string;
  }[];
}

export enum AppRoute {
  HOME = '/',
  CHAT = '/tutor',
  SLIDES = '/slides',
  UPLOAD = '/upload',
  QUIZ = '/quiz',
  MINDMAP = '/mindmap',
  ESSAY = '/essay',
  LIBRARY = '/library',
  ABOUT = '/about'
}