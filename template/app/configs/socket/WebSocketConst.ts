/**
 *
 */
export const WebSocketConstTemplate = (): string => {
  return `
    import type { Options, ConditionalOptions } from './WebSocketTypes';

    export const WEB_SOCKET_DEFAULT: Required<Options> & ConditionalOptions = {
      webSocketOptions: null,
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000 + Math.random() * 4000,
      minUptime: 1000,
      reconnectionDelayGrowFactor: 1.3,
      connectionTimeout: 8000,
      maxRetries: Infinity,
      maxEnqueuedMessages: Infinity,
      startClosed: false,
      autoConnect: true,
      reconnection: true,
      isDebug: false,
      bufferWhileOffline: true,
      queryParams: {},
      pingInterval: 8000,
      pingTimeout: 7000,
      dispatchDeviceEventEmitter: false,
      isThrowEventEveryTime: false,
      isSendPingAfterOpenEvent: true,
      resendEveryQueueItemDelay: 0,
      isLocal: false,
      ipAddress: undefined,
      websocketPort: undefined
    };

    export const WebSocketDeviceEventName = {
      webSocketOnPing: 'WebSocketOnPing',
      webSocketOnPong: 'WebSocketOnPong',
      webSocketOnRequest: 'WebSocketOnRequest',
      webSocketOnAppStateChange: 'WebSocketOnAppStateChange',
      webSocketOnSubscribeParams: 'WebSocketOnSubscribeParams',
      webSocketOnMessage: 'WebSocketOnMessage',
      webSocketOnMessageConnectionTrack: 'WebSocketOnMessageConnectionTrack',
      webSocketOnError: 'WebSocketOnError',
      webSocketOnReconnect: 'WebSocketOnReconnect'
    };

    export const WebSocketSagaTypes = {
      WEB_SOCKET_STATUS: 'WEB_SOCKET_STATUS',
      WEB_SOCKET_ERROR: 'WEB_SOCKET_ERROR'
    };

    export const WebSocketCode = {
      default: 1000, // If code is null or undefine then default is 1000
      closeByAppState: 1001, // If websocket close via app state
      closeByNetInfo: 1002, // If websocket close via internet connection
      closeByCancel: 1003, // If websocket close after connection, user immediate trigger disconnection
      closeByConnectionTimeout: 1004, // If websocket close when web socket connect not establish with server
      closeByPingTimeout: 1005 // If websocket close when pong event not received
    };
  `;
};
