export interface Chapter {
  id: string;
  number: number;
  title: string;
  englishTitle: string;
  summary: string;
  readTime: string;
  videoTimestamp: {
    label: string;
    seconds: number;
    url: string;
  };
  sections: ChapterSection[];
  keyTakeaways: string[];
}

export interface ChapterSection {
  id: string;
  title: string;
  content: string[];
  keyFormula?: {
    formula: string;
    description: string;
  };
  callout?: {
    type: 'warning' | 'tip' | 'info';
    title: string;
    text: string;
  };
  diagramType?: 'atomic' | 'pn-junction' | 'npn-internal' | 'schematic-symbol' | 'switch-circuit' | 'amplifier-circuit' | 'packages' | 'multimeter';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'مقدماتی' | 'متوسط' | 'پیشرفته';
  sourceTimestamp: string;
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
  formula?: string;
}

export type ActiveTab = 'booklet' | 'simulator' | 'atomic-viewer' | 'calculators' | 'quiz' | 'flashcards' | 'multimeter' | 'video-guide';
