/**
 *
 */
export const UseAsyncStorageTemplate = (): string => {
  return `
    import { useEffect, useState } from 'react';
    import { StorageKeyConst } from '../constants';
    import { getStorageItem, removeStorageItem, setStorageItem, AsyncStorageObserver } from '../utils';
    import type { StorageType } from '../utils';

    /**
     * A hook to get and set an item in AsyncStorage.
     * @param key - The key to access the item in storage.
     * @param defaultValue - The default value to return if the item does not exist in storage.
     * @returns An object with the following properties:
     * - item: The current value of the item in storage, or the defaultValue if the item does not exist.
     * - setItem: A function to set the item in storage.
     * - removeItem: A function to remove the item from storage.
     */
    const useAsyncStorage = <T extends StorageType>(key: string, defaultValue: T) => {
      const [item, setItem] = useState<T>();

      /**
       * Removes the item from storage.
       * @returns a Promise that resolves when the storage item is removed
       */
      const removeElement = async () => {
        await removeStorageItem(key);
      };

      /**
       * Sets the item in storage.
       * @param value - The value to be set.
       * @returns a Promise that resolves when the storage item is set
       */
      const setElement = async (value: T) => {
        await setStorageItem<T>(key, value);
      };

      useEffect(() => {
        /**
         * Loads the item from storage and sets the state.
         * @returns {Promise<void>}
         */
        const loadElement = async () => {
          const element: T = await getStorageItem<T>(key, defaultValue);
          setItem(element);
        };
        const keyName = \`\${StorageKeyConst.storageKeyPrefix}-\${key}\`;
        AsyncStorageObserver.getInstance().subscribe(keyName, loadElement);
        return () => {
          AsyncStorageObserver.getInstance().clear(keyName, loadElement);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return {
        item: item,
        setItem: setElement,
        removeItem: removeElement
      };
    };

    export default useAsyncStorage;
  `;
};
