/**
 *
 */
export const ToastHolderTemplate = (): string => {
  return `
    import { isEmpty } from 'lodash';
    import { RegexConst } from '../../constants';
    import type { InternalDataPropsType, ToastHandleType } from './ToastTypes';

    /**
     * A class that holds the toast handle and handles the toast messages.
     */
    export default class ToastHolder {
      static DEFAULT_TIMEOUT: number = 4000;
      static toast: ToastHandleType | null = null;

      static queue: Array<InternalDataPropsType> = [];

      static isRecursiveTimeout: boolean = false;

      /**
       * It sets the toast property to the toast argument if the toast argument is not null
       * @param {ToastHandleType | null} toast - ToastHandleType | null
       */
      static setToast(toast: ToastHandleType | null): void {
        if (toast) {
          this.toast = toast;
        }
      }

      /**
       * It clears the toast.
       */
      static clearToast(): void {
        this.toast = null;
      }

      /**
       * If the message is present and not equal to the cancelSaga message, then return true
       * @param {string} [message] - The message to be displayed.
       * @returns A boolean value.
       */
      static ignoreMessage(message?: string): boolean {
        if (!isEmpty(message)) {
          return true;
        }
        return false;
      }

      /**
       * If the message is not in the ignore list, then show the message
       */
      static toastMessage(message: InternalDataPropsType): void {
        if (!this.isRecursiveTimeout) {
          if (
            this.ignoreMessage(
              message.message?.replace(RegexConst.validToastTitleAndMessage, '')?.trim()
            )
          ) {
            this.toast?.toastWithType({
              type: message?.type,
              title: message?.title?.replace(RegexConst.validToastTitleAndMessage, '')?.trim(),
              message: message?.message?.replace(RegexConst.validToastTitleAndMessage, '').trim(),
              interval: message?.interval === undefined ? this.DEFAULT_TIMEOUT : message?.interval
            });
          }
        } else {
          this.queue.push(message);
        }
      }

      /**
       * If the toast is not open, then show the first message in the queue. If the toast is open, then add
       * the message to the queue
       */
      static toastMessages(messages: InternalDataPropsType[]): void {
        if (!this.isRecursiveTimeout) {
          this.queue.push(...messages);
          this.isRecursiveTimeout = true;
          this.toast?.toastLifecycle((isOpen) => {
            if (!isOpen) {
              if (this.queue.length > 0) {
                const firstMessage: InternalDataPropsType | undefined = this.queue.shift();
                if (
                  this.ignoreMessage(
                    firstMessage?.message?.replace(RegexConst.validToastTitleAndMessage, '')?.trim()
                  )
                ) {
                  this.toast?.toastWithType({
                    type: firstMessage!.type,
                    title: firstMessage?.title
                      ?.replace(RegexConst.validToastTitleAndMessage, '')
                      ?.trim(),
                    message: firstMessage!.message
                      ?.replace(RegexConst.validToastTitleAndMessage, '')
                      ?.trim(),
                    interval:
                      firstMessage?.interval === undefined
                        ? this.DEFAULT_TIMEOUT
                        : firstMessage?.interval
                  });
                }
              } else {
                this.isRecursiveTimeout = false;
              }
            }
          });
        } else {
          this.queue.push(...messages);
        }
      }

      /**
       * It closes the toast.
       */
      static closeToast(): void {
        this.toast?.clearToast();
      }
    }
  `;
};
