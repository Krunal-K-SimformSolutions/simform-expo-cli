import _ from 'lodash';
import ora from 'ora';
import { AppConstant } from '../constants/index.js';
import { stringFormat } from './StringUtils.js';
import type { StringData } from './StringUtils.js';
import type { Color, Ora } from 'ora';

export type KeyTag =
  | 'Questionnaire'
  | 'Project Generate'
  | 'NPM Install'
  | 'Pre Requisite'
  | 'General';

/**
 *
 */
export class Indicators {
  private static readonly MAX_INSTANCE: number = 5;
  static #instanceMap: Record<KeyTag | string, Indicators> = {};

  readonly spinner?: Ora;
  private colorInterval?: NodeJS.Timeout;

  /**
   *
   */
  public static getInstance(keyTag: KeyTag = 'Project Generate'): Indicators {
    const numberOfInstance = _.size(Indicators.#instanceMap) - 1;
    if (numberOfInstance >= Indicators.MAX_INSTANCE) {
      throw Error(AppConstant.StringConstants.maxIndicatorInstance);
    }

    if (!_.has(Indicators.#instanceMap, keyTag)) {
      Indicators.#instanceMap[keyTag] = new Indicators();
    }
    return Indicators.#instanceMap[keyTag];
  }

  /**
   *
   */
  private constructor() {
    this.spinner = ora({ discardStdin: false });
    this.spinner.suffixText = '...';
    this.spinner.spinner = AppConstant.SpinnerConstants;
  }

  /**
   *
   */
  public start() {
    const colors: Array<Color> = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'gray'];
    if (this.spinner) {
      this.spinner.start();
      this.colorInterval = setInterval(() => {
        if (this.spinner) {
          this.spinner.color = colors[Math.floor(Math.random() * colors.length)];
        }
      }, 500);
    }
  }

  /**
   *
   */
  public stop() {
    if (this.spinner) {
      this.spinner.stopAndPersist();
      clearInterval(this.colorInterval);
    }
  }

  /**
   *
   */
  public changeMessage(
    message: string | StringData,
    type: 'succeed' | 'fail' | 'warn' | 'info' | 'text' = 'text'
  ) {
    if (this.spinner) {
      if (type === 'text') {
        if (typeof message === 'string') {
          this.spinner[type] = message;
        } else {
          this.spinner.text = stringFormat(message);
        }
      } else {
        if (typeof message === 'string') {
          this.spinner[type](message);
        } else {
          this.spinner[type](stringFormat(message));
        }
      }
    }
  }
}
