import { isDarkMode } from '../utils/index.js';
import type { ColorInput } from 'tinycolor2';
import type { StopInput } from 'tinygradient';

/**
 * This is not a class definition, but rather a type definition in TypeScript.
 * It defines a type alias called ColorType that represents an object with specific properties related to colors.
 *
 * Here is a succinct explanation of the properties:
 *
 * logo: an array of color inputs or stop inputs
 * title, question, help, answer, defaultAnswer, error, success, highlight, key: string values representing different colors
 * task: an object with properties loading, idle, and done, each representing a color string
 * prefix: an object with properties done, idle, and loading, each representing a color string
 */
export type ColorType = {
  logo: ColorInput[] | StopInput[];
  title: string;
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

/**
 * This is not a class definition, but rather a type definition in TypeScript.
 * It defines a type alias called ColorType that represents an object with specific properties related to colors.
 *
 * Here is a succinct explanation of the properties:
 *
 * logo: an array of color inputs or stop inputs
 * title, question, help, answer, defaultAnswer, error, success, highlight, key: string values representing different colors
 * task: an object with properties loading, idle, and done, each representing a color string
 * prefix: an object with properties done, idle, and loading, each representing a color string
 */
const dark: ColorType = {
  logo: ['#DC2626', '#EF4444'],
  title: '#EF5264',
  question: '#F59E0B',
  help: '#3B82F6',
  answer: '#06B6D4',
  defaultAnswer: '#9CA3AF',
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

/**
 * This is not a class definition, but rather a type definition in TypeScript.
 * It defines a type alias called ColorType that represents an object with specific properties related to colors.
 *
 * Here is a succinct explanation of the properties:
 *
 * logo: an array of color inputs or stop inputs
 * title, question, help, answer, defaultAnswer, error, success, highlight, key: string values representing different colors
 * task: an object with properties loading, idle, and done, each representing a color string
 * prefix: an object with properties done, idle, and loading, each representing a color string
 */
const light: ColorType = {
  logo: ['#DC2626', '#EF4444'],
  title: '#EF5264',
  question: '#D97706',
  help: '#2563EB',
  answer: '#0891B2',
  defaultAnswer: '#6B7280',
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
 * Gets the theme based on the current system appearance.
 *
 * @returns The dark or light theme, depending on the system appearance.
 */
export const getTheme = () => {
  const isDark = isDarkMode();
  if (isDark) {
    return dark;
  } else {
    return light;
  }
};
