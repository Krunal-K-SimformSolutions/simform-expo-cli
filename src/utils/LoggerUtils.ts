import { stringBuilder, stringFormat } from './StringUtils.js';
import type { StringData } from './StringUtils.js';

/**
 * Logs styled text to the console using the chalk library.
 *
 * @param data - An object or an array of objects containing styling options
 * and the text to log. Each object can have the following properties:
 *   - `modifiers`: A modifier or an array of modifiers (e.g., 'bold', 'italic')
 *     to apply to the text.
 *   - `color`: The foreground color for the text.
 *   - `background`: The background color for the text.
 *   - `text`: The actual text to display.
 *
 * The function supports chaining of modifiers, colors, and backgrounds
 * to produce styled console output. If no styling options are provided,
 * the text defaults to white color.
 */
export const logger = (data: StringData | Array<StringData>) => {
  if (Array.isArray(data)) {
    // eslint-disable-next-line no-restricted-syntax
    console.log(stringBuilder(data));
  } else {
    // eslint-disable-next-line no-restricted-syntax
    console.log(stringFormat(data));
  }
};
