import { isDarkMode } from '../utils/index.js';

export type ColorType = {
  logo: Array<string>;
  title: Array<string>;
  question: string;
  help: string;
  answer: string;
  defaultAnswer: string;
  error: string;
  success: string;
  highlight: string;
  key: string;
  task: {
    loading: string;
    idle: string;
    done: string;
  };
  prefix: {
    done: string;
    idle: string;
    loading: string;
  };
};

const light: ColorType = {
  logo: ['#FF0000', '#E90B0B', '#D31616', '#E90B0B', '#FF0000'],
  title: ['#ff0000', '#ff0100'],
  question: '#3B82F6',
  help: '#F59E0B',
  answer: '#9CA3AF',
  defaultAnswer: '#06B6D4',
  error: '#EF4444',
  success: '#14B8A6',
  highlight: '#C084FC',
  key: '#A3E635',
  prefix: {
    done: '#10B981',
    idle: '#EC4899',
    loading: '#EF4444'
  },
  task: {
    done: '#10B981',
    idle: '#EC4899',
    loading: '#EF4444'
  }
};

const dark: ColorType = {
  logo: ['#FF0000', '#E90B0B', '#D31616', '#E90B0B', '#FF0000'],
  title: ['#ff0000', '#ff0100'],
  question: '#2563EB',
  help: '#D97706',
  answer: '#6B7280',
  defaultAnswer: '#0891B2',
  error: '#DC2626',
  success: '#0D9488',
  highlight: '#A855F7',
  key: '#84CC16',
  prefix: {
    done: '#059669',
    idle: '#DB2777',
    loading: '#DC2626'
  },
  task: {
    done: '#059669',
    idle: '#DB2777',
    loading: '#DC2626'
  }
};

/**
 *
 */
export const getTheme = () => {
  if (isDarkMode()) {
    return dark;
  } else {
    return light;
  }
};
