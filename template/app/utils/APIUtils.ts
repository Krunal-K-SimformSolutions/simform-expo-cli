import { QuestionAnswer, AppConstant } from '../../../src/index.js';

/**
 *
 */
const getProblemFromErrorTemplate = (
  isAWSAmplify: boolean,
  isAxios: boolean,
  isFetch: boolean
): string => {
  if (isAWSAmplify && isAxios && isFetch) {
    return "if (API.isCancel(error) || isCancel(error) || error.name === 'AbortError') return CANCEL_ERROR;";
  } else if (isAWSAmplify && isAxios) {
    return 'if (API.isCancel(error) || isCancel(error)) return CANCEL_ERROR;';
  } else if (isAWSAmplify && isFetch) {
    return "if (API.isCancel(error) || isCancel(error) || error.name === 'AbortError') return CANCEL_ERROR;";
  } else if (isAxios && isFetch) {
    return "if (isCancel(error) || error.name === 'AbortError') return CANCEL_ERROR;";
  } else if (isAWSAmplify) {
    return 'if (API.isCancel(error) || isCancel(error)) return CANCEL_ERROR;';
  } else if (isAxios) {
    return 'if (isCancel(error)) return CANCEL_ERROR;';
  } else if (isFetch) {
    return "if (error.name === 'AbortError') return CANCEL_ERROR;";
  } else {
    return '';
  }
};

/**
 *
 */
export const APIUtilsTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
  const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

  return `
    ${isAWSAmplify ? "import { API } from 'aws-amplify';" : ''}
    ${isAWSAmplify || isAxios ? "import { isCancel } from 'axios';" : ''}
    import { type PROBLEM_CODE } from '../configs';
    import {
      CANCEL_ERROR,
      CLIENT_ERROR,
      CONNECTION_ERROR,
      NETWORK_ERROR,
      NODEJS_CONNECTION_ERROR_CODES,
      NONE,
      SERVER_ERROR,
      TIMEOUT_ERROR,
      TIMEOUT_ERROR_CODES,
      UNKNOWN_ERROR
    } from '../constants';

    /**
     * Converts the parameter to a number.
     *
     * Number, null, and undefined will return themselves,
     * but everything else will be convert to a Number, or
     * die trying.
     *
     * @param {String} the String to convert
     * @return {Number} the Number version
     * @example
     * toNumber('7') //=> 7
     */
    export const toNumber = (value: any): number => {
      // if value is a Date, convert to a number
      if (value instanceof Date) {
        return value.getTime();
      }

      if (typeof value === 'number' || value === null || value === undefined) {
        return value;
      }

      return Number(value);
    };

    /**
     * Given a min and max, determines if the value is included
     * in the range.
     *
     * @sig Number a -> a -> a -> b
     * @param {Number} the minimum number
     * @param {Number} the maximum number
     * @param {Number} the value to test
     * @return {Boolean} is the value in the range?
     * @example
     * isWithin(1, 5, 3) //=> true
     * isWithin(1, 5, 1) //=> true
     * isWithin(1, 5, 5) //=> true
     * isWithin(1, 5, 5.1) //=> false
     */
    export const isWithin = (min: number, max: number, value: number): boolean =>
      value >= min && value <= max;

    /**
     * Identify HTTP status code range, return back the appropriate group.
     */
    export const in200s = (n: number): boolean => isWithin(200, 299, n);

    /**
     * Identify HTTP status code range, return back the appropriate group.
     */
    export const in400s = (n: number): boolean => isWithin(400, 499, n);

    /**
     * Identify HTTP status code range, return back the appropriate group.
     */
    export const in500s = (n: number): boolean => isWithin(500, 599, n);

    /**
     * Given a HTTP status code, return back the appropriate problem enum.
     */
    export const getProblemFromStatus = (status: undefined | null | number): PROBLEM_CODE => {
      if (!status) return UNKNOWN_ERROR;
      if (in200s(status)) return NONE;
      if (in400s(status)) return CLIENT_ERROR;
      if (in500s(status)) return SERVER_ERROR;
      return UNKNOWN_ERROR;
    };

    /**
     * What's the problem for this axios response?
     */
    export const getProblemFromError = (error: any): PROBLEM_CODE => {
      // first check if the error message is Network Error (set by axios at 0.12) on platforms other than NodeJS.
      if (error?.message === 'Network Error') return NETWORK_ERROR;

      ${getProblemFromErrorTemplate(isAWSAmplify, isAxios, isFetch)}

      // then check the specific error code
      if (!error?.code)
        return getProblemFromStatus(
          error?.response ? error?.response?.status : undefined
        );
      if (TIMEOUT_ERROR_CODES.includes(error?.code)) return TIMEOUT_ERROR;
      if (NODEJS_CONNECTION_ERROR_CODES.includes(error?.code)) return CONNECTION_ERROR;
      return UNKNOWN_ERROR;
    };
  `;
};
