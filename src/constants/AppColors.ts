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
  question: '#2673DD',
  help: '#FFBB00',
  answer: '#648BA7',
  defaultAnswer: '#648BA7',
  error: '#EE2C4A',
  success: '#44CC77',
  highlight: '#FF8B5D',
  key: '#666666',
  prefix: {
    done: '#44CC77',
    idle: '#FF73D8',
    loading: '#D31616'
  },
  task: {
    done: '#44CC77',
    loading: '#D31616'
  }
};

const dark: ColorType = {
  logo: ['#FF0000', '#E90B0B', '#D31616', '#E90B0B', '#FF0000'],
  title: ['#ff0000', '#ff0100'],
  question: '#2673DD',
  help: '#B2B400',
  answer: '#5576BE',
  defaultAnswer: '#5576BE',
  error: '#AB2830',
  success: '#309D53',
  highlight: '#E06C3E',
  key: '#A0A0A0',
  prefix: {
    done: '#309D53',
    idle: '#E054B9',
    loading: '#D31616'
  },
  task: {
    done: '#309D53',
    loading: '#D31616'
  }
};

export const getTheme = () => {
  if (isDarkMode()) {
    return dark;
  } else {
    return light;
  }
};
