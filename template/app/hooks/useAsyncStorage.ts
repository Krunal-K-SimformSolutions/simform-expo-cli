export const UseAsyncStorageTemplate = (): string => {
  return `
    import { useEffect, useState } from 'react';
    import {
      getStorageItem,
      removeStorageItem,
      setStorageItem,
      StorageType,
      AsyncStorageObserver
    } from '../utils';
    import { StorageKeyConst } from '../constants';

    const useAsyncStorage = <T extends StorageType>(key: string, defaultValue: T) => {
      const [item, setItem] = useState<T>();

      const removeElement = async () => {
        await removeStorageItem(key);
      };

      const setElement = async (value: T) => {
        await setStorageItem<T>(key, value);
      };

      useEffect(() => {
        const loadElement = async () => {
          const element: T = await getStorageItem<T>(key, defaultValue);
          setItem(element);
        };
        const keyName = \`\${StorageKeyConst.storageKeyPrefix}-\${key}\`;
        AsyncStorageObserver.getInstance().subscribe(keyName, loadElement);
        return () => {
          AsyncStorageObserver.getInstance().clear(keyName, loadElement);
        };
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
