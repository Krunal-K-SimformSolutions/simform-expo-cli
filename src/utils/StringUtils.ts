import chalk, { ForegroundColorName, BackgroundColorName, ModifierName } from 'chalk';

export interface StringData {
  modifiers?: ModifierName;
  color?: ForegroundColorName;
  background?: BackgroundColorName;
  text: string;
}

export const stringFormat = ({ modifiers, color, background, text }: StringData): string => {
  if (modifiers && color && background) {
    return chalk[modifiers][color][background](text);
  } else if (modifiers && color) {
    return chalk[modifiers][color](text);
  } else if (modifiers && background) {
    return chalk[modifiers][background](text);
  } else if (color && background) {
    return chalk[color][background](text);
  } else if (modifiers) {
    return chalk[modifiers](text);
  } else if (color) {
    return chalk[color](text);
  } else if (background) {
    return chalk[background](text);
  }
  return chalk.white(text);
};

export const stringBuilder = (data: StringData | Array<StringData>): string => {
  if (Array.isArray(data)) {
    return data.map((item) => stringFormat(item)).join('');
  } else {
    return stringFormat(data);
  }
};

export const questionBuilder = (questionText: string, helpText?: string): string => {
  return `${stringBuilder({ text: questionText, color: 'yellowBright' })}\n${stringBuilder({ text: helpText ?? '', color: 'blueBright', modifiers: 'dim' })}\n`;
};
