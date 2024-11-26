/**
 *
 */
export const StoreActionConstTemplate = (): string => {
  return `
    /**
     * A list of all the possible toolkit actions that can be taken by the user.
     */
    export default Object.freeze({
      signIn: 'signIn'
    });
  `;
};
