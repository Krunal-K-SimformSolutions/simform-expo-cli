/**
 *
 */
export const NotFoundScreenTemplate = (): string => {
  return `
    import { Stack } from 'expo-router';
    import React from 'react';
    import { CustomText } from '../components';

    /**
     * The Not Found Screen.
     */
    const NotFoundScreen = () => {
      return (
        <>
          <Stack.Screen options={{ title: 'Oops!' }} />
          <CustomText variant="semiBold16">This screen doesn't exist.</CustomText>
          <CustomText variant="medium14">Go to home screen!</CustomText>
        </>
      );
    }

    export default NotFoundScreen;
  `;
};
