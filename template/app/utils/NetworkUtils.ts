/**
 *
 */
export const NetworkUtilsTemplate = (): string => {
  return `
    import * as Network from 'expo-network';
    import { type EventSubscription } from 'expo-modules-core';

    /**
     * Internally this class has a network state manager class to handle all the functionality and state.
     * It allows you to get information on: Connection type, Connection quality
     */
    export class NetworkThread {
      static #instance: NetworkThread;
      private isConnected: boolean;
      private subscriptionNetInfo: EventSubscription;

      /**
       * Determines if the network is considered connected based on the given state.
       * If both isConnected and isInternetReachable are null, it defaults to true,
       * otherwise it checks if both are true and returns the result.
       *
       * @param {Network.NetworkState} state - The current network state.
       * @returns {boolean} - True if the network is connected and internet is reachable, false otherwise.
       */
      private getConnected(state: Network.NetworkState): boolean {
        if (state?.isConnected === null && state?.isInternetReachable === null) {
          return true;
        } else {
          return (state?.isConnected && state?.isInternetReachable) ?? false;
        }
      }

      /**
       * The NetworkThread's constructor should always be private to prevent direct
       * construction calls with the \`new\` operator.
       */
      private constructor() {
        this.isConnected = true;
        Network.getNetworkStateAsync()
          .then((state: Network.NetworkState) => {
            this.isConnected = this.getConnected(state);
          })
          .catch(() => {
            this.isConnected = false;
          });

        this.subscriptionNetInfo = Network.addNetworkStateListener(
          (nextNetInfo: Network.NetworkStateEvent) => {
            try {
              const prevFlag: boolean = this.isConnected;
              const flag: boolean = this.getConnected(nextNetInfo);
              if (prevFlag !== flag) {
                this.isConnected = flag;
              }
            } catch {
              // @TODO: no need to handle error
            }
          }
        );
      }

      /**
       * The static getter that controls access to the network thread instance.
       *
       * This implementation allows you to extend the NetworkThread class while
       * keeping just one instance of each subclass around.
       */
      public static get instance(): NetworkThread {
        if (!NetworkThread.#instance) {
          NetworkThread.#instance = new NetworkThread();
        }

        return NetworkThread.#instance;
      }

      /**
       * Remove net info subscription for real time listen network status
       */
      public removeListener() {
        this.subscriptionNetInfo.remove();
      }

      /**
       * get internet available or not
       */
      public get connected(): boolean {
        return this.isConnected;
      }
    }
  `;
};
