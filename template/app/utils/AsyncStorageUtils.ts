import { QuestionAnswer, AppConstant } from '../../../src/index.js';

/**
 *
 */
export const AsyncStorageUtilsTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);

  return `
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { isEmpty${isAWSAmplify ? ', filter, forEach, has, startsWith' : ''} } from 'lodash';
    import { StorageKeyConst } from '../constants';
    ${isAWSAmplify ? "import { KeyValuePair } from '@react-native-async-storage/async-storage/lib/typescript/types';" : ''}

    export type StorageType = boolean | string | number | object;

    /**
     * A class to observe AsyncStorage changes.
     */
    export class AsyncStorageObserver {
      private subscribers: Map<string, (() => Promise<void>)[]> = new Map();
      static #instance: AsyncStorageObserver;

      private constructor() {}

      /**
       * The static method that controls the access to the singleton instance.
       * @returns {AsyncStorageObserver} - The singleton instance.
       */
      static getInstance() {
        if (!AsyncStorageObserver.#instance) {
          AsyncStorageObserver.#instance = new AsyncStorageObserver();
        }
        return AsyncStorageObserver.#instance;
      }

      /**
       * Subscribe to a specific storage key.
       * @param key - the key to subscribe to
       * @param cb - the callback to be called when the key is updated
       */
      subscribe(key: string, cb: () => Promise<void>) {
        if (this.subscribers.has(key)) {
          this.subscribers.get(key)?.push(cb);
        } else {
          this.subscribers.set(key, [cb]);
        }
        cb(); // call callback on subscribe to get latest data
      }

      /**
       * Notify all subscribers of a specific key.
       * @param key - the key to notify the subscribers of
       */
      notify(key: string) {
        if (this.subscribers.has(key)) {
          this.subscribers.get(key)?.forEach((cb) => cb());
        }
      }

      /**
       * Removes a specific subscriber callback for a given storage key.
       * If the callback is the only subscriber, the key is removed from the subscribers map.
       *
       * @param key - The storage key associated with the subscriber.
       * @param cb - The callback function to remove from the list of subscribers.
       */
      clear(key: string, cb: () => Promise<void>) {
        const listeners = this.subscribers.get(key) ?? [];
        const filteredListeners = listeners.filter((fn) => cb !== fn);
        if (filteredListeners.length) {
          this.subscribers.set(key, filteredListeners);
        } else {
          this.subscribers.delete(key);
        }
      }
    }
      
    /**
     * Set a specific item in storage.
     * @param key - the key for the item
     * @param value - the value
     * @returns a Promise that resolves when the storage item is set
     */
    export const setStorageItem = async <T extends StorageType>(
      key: string,
      value: T
    ): Promise<void> => {
      const keyName = \`\${StorageKeyConst.storageKeyPrefix}-\${key}\`;
      let newValue: string;
      if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
        newValue = String(value);
      } else {
        newValue = JSON.stringify(value);
      }
      await AsyncStorage.setItem(keyName, newValue);
      AsyncStorageObserver.getInstance().notify(keyName);
    };

    /**
     * Get a specific item from storage.
     * @param key - the key for the item
     * @param defaultValue - the default value if the item does not exist
     * @returns the value of the item from storage, or the defaultValue if the item does not exist
     */
    export const getStorageItem = async <T extends StorageType>(
      key: string,
      defaultValue: T
    ): Promise<T> => {
      const keyName = \`\${StorageKeyConst.storageKeyPrefix}-\${key}\`;
      const value = (await AsyncStorage.getItem(keyName)) ?? '';
      if (isEmpty(value)) {
        return defaultValue;
      } else if (typeof defaultValue === 'boolean') {
        return Boolean(value) as T;
      } else if (typeof defaultValue === 'string') {
        return String(value) as T;
      } else if (typeof defaultValue === 'number') {
        return Number(value) as T;
      }
      return JSON.parse(value);
    };

    /**
     * Merge a specific item in storage.
     * @param key - the key for the item
     * @param value - the value to be merged
     * @returns a Promise that resolves when the storage item is merged
     */
    export const mergeStorageItem = async <T extends StorageType>(
      key: string,
      value: T
    ): Promise<void> => {
      const keyName = \`\${StorageKeyConst.storageKeyPrefix}-\${key}\`;
      let newValue: string;
      if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
        newValue = String(value);
      } else {
        newValue = JSON.stringify(value);
      }
      await AsyncStorage.mergeItem(keyName, newValue);
      AsyncStorageObserver.getInstance().notify(keyName);
    };

    /**
     * Clears all items from storage.
     * @returns a Promise that resolves when the storage is cleared
     */
    export const clearStorage = async (): Promise<void> => {
      await AsyncStorage.clear();
    };

    /**
     * Removes a specific item from storage.
     * @param key - the key for the item to be removed
     * @returns a Promise that resolves when the storage item is removed
     */
    export const removeStorageItem = async (key: string): Promise<void> => {
      const keyName = \`\${StorageKeyConst.storageKeyPrefix}-\${key}\`;
      await AsyncStorage.removeItem(keyName);
      AsyncStorageObserver.getInstance().notify(keyName);
    };

    ${
      isAWSAmplify
        ? `
            let dataMemory: Record<string, string | undefined> = {};
            /**
             * Create storage class for aws amplify cache
             */
            export class AWSAmplifyStorage {
              // the promise returned from sync function
              static syncPromise: Promise<boolean> | null = null;

              /**
               * This is used to set a specific item in storage
               * @param {string} key - the key for the item
               * @param {object} value - the value
               * @returns {string} value that was set
               */
              static setItem(key: string, value: string): string | undefined {
                const originalKey: string = \`\${StorageKeyConst.storageKeyPrefix}_\${key}\`;
                AsyncStorage.setItem(originalKey, value);
                dataMemory[originalKey] = value;
                return dataMemory[originalKey];
              }

              /**
               * This is used to get a specific key from storage
               * @param {string} key - the key for the item
               * This is used to clear the storage
               * @returns {string} the data item
               */
              static getItem(key: string): string | undefined {
                const originalKey: string = \`\${StorageKeyConst.storageKeyPrefix}_\${key}\`;
                const isLocalAvailable =
                  has(dataMemory, originalKey) || Object.prototype.hasOwnProperty.call(dataMemory, originalKey);
                return isLocalAvailable ? dataMemory[originalKey] : undefined;
              }

              /**
               * This is used to remove an item from storage
               * @param {string} key - the key being set
               * @returns {string} value - value that was deleted
               */
              static removeItem(key: string): boolean {
                const originalKey: string = \`\${StorageKeyConst.storageKeyPrefix}_\${key}\`;
                AsyncStorage.removeItem(originalKey);
                return delete dataMemory[originalKey];
              }

              /**
               * This is used to clear the storage
               * @returns {string} nothing
               */
              static clear(): Record<string, string | undefined> {
                forEach(Object.keys({ ...dataMemory }), (key: string) => {
                  AsyncStorage.removeItem(key);
                });
                dataMemory = {};
                return dataMemory;
              }

              /**
               * If the storage operations are async(i.e AsyncStorage)
               * Then you need to sync those items into the memory in this method
               */
              static sync(): Promise<boolean> {
                if (!AWSAmplifyStorage.syncPromise) {
                  AWSAmplifyStorage.syncPromise = new Promise((res, _) => {
                    AsyncStorage.getAllKeys()
                      .then((keys: readonly string[]) => {
                        if (isEmpty(keys)) {
                          res(true);
                        } else {
                          const originalKeys: string[] = filter(keys, (key: string) =>
                            startsWith(key, \`\${StorageKeyConst.storageKeyPrefix}_\`)
                          );
                          AsyncStorage.multiGet(originalKeys)
                            .then((keyValuePairs: readonly KeyValuePair[]) => {
                              forEach(keyValuePairs, ([key, value]: KeyValuePair) => {
                                dataMemory[key] = value ?? '';
                              });
                              res(true);
                            })
                            .catch(() => {
                              res(true);
                            });
                        }
                      })
                      .catch(() => {
                        res(true);
                      });
                  });
                }
                return AWSAmplifyStorage.syncPromise;
              }
            }
          `
        : ''
    }
  `;
};
