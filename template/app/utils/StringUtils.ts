/**
 *
 */
export const StringUtilsTemplate = (): string => {
  return `
    import { isNaN } from 'lodash';
    import { RegexConst } from '../constants';

    /**
     * If the value is null or undefined, return true. Otherwise, return true if the string is empty or
     * contains only whitespace
     * @param {string | null} value - string | null
     * @returns A boolean value.
     */
    export function isNullOrWhiteSpace(value?: string | null): boolean {
      try {
        if (value === null || value === 'null' || value === undefined || value === 'undefined') {
          return true;
        }
        return value.toString().replace(RegexConst.stringClean, '').length < 1;
      } catch {
        return false;
      }
    }

    /**
     * "Given a number and a format template, return a string that is the number formatted to the
     * template."
     *
     * The function takes two parameters:
     *
     * input: number
     * formatTemplate: string
     * The function returns a string
     * @param {number} input - The number to format
     * @param {string} formatTemplate - The format template to use.
     * @returns A string
     */
    export function formatNumber(input?: number | null, formatTemplate?: string | null): string {
      const count = formatTemplate?.length ?? 0;
      const stringValue = input?.toString() ?? '';
      if (count <= stringValue.length) {
        return stringValue;
      }

      let remainingCount = count - stringValue.length;
      remainingCount += 1; //Array must have an extra entry
      return new Array(remainingCount).join('0') + stringValue;
    }

    /**
     * It takes a string with placeholders in it, and replaces the placeholders with values from an object
     * @param {string} format - The string to format.
     * @param args - The arguments to be passed to the format string.
     * @param [parseByObject=false] - If the args parameter is an object, then this should be true.
     * @returns A string
     */
    export function formatString(format?: string | null, args?: Record<string, any> | null): string {
      return (
        format?.toString()?.replace(RegexConst.stringArg, function (match, x) {
          //0
          const s = match.split(':');
          if (s.length > 1) {
            x = s[0].replace('{', '');
            match = s[1].replace('}', ''); //U
          }

          const arg: any = args?.[x];
          if (arg === null || arg === undefined || match.match(RegexConst.stringFormat)) {
            return arg;
          }
          if ((typeof arg === 'number' || !isNaN(arg)) && !isNaN(+match) && !isNullOrWhiteSpace(arg)) {
            return formatNumber(arg, match);
          }
          return typeof arg !== 'undefined' && arg !== null ? arg : '';
        }) ?? ''
      );
    }
  `;
};
