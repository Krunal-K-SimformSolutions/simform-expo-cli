import ora, { Color, Ora } from 'ora';
import { StringData, stringFormat } from './StringUtils';
import AppConstant from '@/AppConstant';

export class Indicators {
  static #instance: Indicators;

  readonly spinner?: Ora;
  private colorInterval?: NodeJS.Timeout;

  public static get instance(): Indicators {
    if (!Indicators.#instance) {
      Indicators.#instance = new Indicators();
    }

    return Indicators.#instance;
  }

  private constructor() {
    this.spinner = ora();
    this.spinner.suffixText = '...';
    this.spinner.spinner = AppConstant.SpinnerConstants;
  }

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

  public stop() {
    if (this.spinner) {
      this.spinner.stopAndPersist();
      clearInterval(this.colorInterval);
    }
  }

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
