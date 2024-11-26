export * from './_layout.js';
export * from './+not-found.js';

/**
 *
 */
export const ModulesScreenTemplate = (): string => {
  return `
    import { Stack } from 'expo-router';
    import React from 'react';
    import { CustomText } from '../components';

    /**
     * The Modules Screen.
     */
    const ModulesScreen = () => {
      return (
        <>
          <Stack.Screen options={{ title: 'Oops!' }} />
          <CustomText variant="semiBold16">This screen doesn't exist.</CustomText>
        </>
      );
    };

    export default ModulesScreen;
  `;
};
