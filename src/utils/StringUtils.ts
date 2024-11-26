import chalk from 'chalk';
import type { ColorType } from '../constants/index.js';
import type { ChalkInstance } from 'chalk';
import type { GradientFunction } from 'gradient-string';

export type StringData = {
  modifiers?: ChalkInstance;
  color?: string;
  background?: string;
  text: string;
  gradient?: GradientFunction;
};

/**
 *
 */
export const stringFormat = ({
  modifiers,
  color,
  background,
  text,
  gradient
}: StringData): string => {
  let chalkStr = '';
  const newText = gradient ? gradient(text) : text;
  if (modifiers && color && background) {
    chalkStr = modifiers.hex(color).bgHex(background)(newText);
  } else if (modifiers && color) {
    chalkStr = modifiers.hex(color)(newText);
  } else if (modifiers && background) {
    chalkStr = modifiers.bgHex(background)(newText);
  } else if (color && background) {
    chalkStr = chalk.hex(color).bgHex(background)(newText);
  } else if (modifiers) {
    chalkStr = modifiers(newText);
  } else if (color) {
    chalkStr = chalk.hex(color)(newText);
  } else if (background) {
    chalkStr = chalk.bgHex(background)(newText);
  } else {
    chalkStr = newText;
  }

  return chalkStr;
};

/**
 *
 */
export const stringBuilder = (data: StringData | Array<StringData>): string => {
  if (Array.isArray(data)) {
    return data.map((item) => stringFormat(item)).join('');
  } else {
    return stringFormat(data);
  }
};

/**
 *
 */
export const questionBuilder = (
  colors: ColorType,
  questionText: string,
  helpText?: string
): string => {
  const list: Array<string> = [];
  if ((questionText?.length ?? 0) > 0) {
    list.push(
      stringBuilder({ text: questionText, color: colors.question, modifiers: chalk.italic.bold })
    );
  }
  if ((helpText?.length ?? 0) > 0) {
    list.push(
      stringBuilder({ text: helpText ?? '', color: colors.help, modifiers: chalk.italic.dim })
    );
  }
  return `${list.join('\n')}\n`;
};

/**
 *
 */
export const addSpaces = (str: string, numSpaces: number): string => {
  const spaces = ' '.repeat(numSpaces);
  return `${spaces}${str}`;
};
