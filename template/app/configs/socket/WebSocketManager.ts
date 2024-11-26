import { QuestionAnswer, AppConstant } from '../../../../src/index.js';

/**
 *
 */
export const WebSocketManagerTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isReactRedux = variables.isSupportStateManagement(AppConstant.StateManagement.ReactRedux);

  return `
    import { size, has, isEmpty, isEqual, forEach, delay } from 'lodash';
    import { DeviceEventEmitter } from 'react-native';
    import { StringConst } from '../../constants';
    import { logger, getAccessToken } from '../../utils';
    import { WEB_SOCKET_DEFAULT, WebSocketCode, WebSocketDeviceEventName } from './WebSocketConst';
    import {
      CloseEvent,
      type OpenEvent,
      type SocketMessageEvent,
      type DispatchEventType,
      ErrorEvent,
      type ListenersMap,
      MessageEvent,
      PingEvent,
      PongEvent,
      type ProductName,
      type ProtocolsProvider,
      ReconnectEvent,
      RequestEvent,
      type UrlProvider,
      type WebSocketEmitPayloadType,
      type WebSocketEventListenerMap,
      type WebSocketEventMap,
      type WebSocketOptions,
      WebSocketStatus
    } from './WebSocketTypes';

    /**
     * The WebSocketManager class is a singleton class that manages the WebSocket connection.
     */
    export default class WebSocketManager {
      private static TAG: string = 'WS ->';
      public static TAG_SAGA: string = 'WS-SAGA ->';
      private static MAX_INSTANCE: number = 3;
      private static instanceMap: Record<ProductName | string, WebSocketManager> = {};

      /**
       * The Singleton's constructor should always be private to prevent direct
       * construction calls with the \`new\` operator.
       */
      private constructor() {}

      /**
       * The static method that controls the access to the singleton instance.
       */
      public static getInstance(productName: ProductName = 'ICT'): WebSocketManager {
        const numberOfInstance = size(WebSocketManager.instanceMap) - 1;
        if (numberOfInstance >= WebSocketManager.MAX_INSTANCE) {
          throw Error(StringConst.WebSocketError.maxInstance);
        }

        if (!has(WebSocketManager.instanceMap, productName)) {
          WebSocketManager.instanceMap[productName] = new WebSocketManager();
        }
        return WebSocketManager.instanceMap[productName];
      }

      /**
       * The static method that controls the access to the singleton instance.
       */
      public static removeInstance(productName: ProductName = 'ICT'): void {
        const numberOfInstance = size(WebSocketManager.instanceMap) - 1;
        if (numberOfInstance >= WebSocketManager.MAX_INSTANCE) {
          throw Error(StringConst.WebSocketError.maxInstance);
        }

        if (!has(WebSocketManager.instanceMap, productName)) {
          throw Error(StringConst.WebSocketError.instanceRemove);
        }
        delete WebSocketManager.instanceMap[productName];
      }

      private _ws?: WebSocket | null;
      private _listeners: ListenersMap = {
        error: [],
        message: [],
        open: [],
        close: [],
        ping: [],
        pong: [],
        reconnect: [],
        request: []
      };
      private _retryCount: number = -1;
      private _uptimeTimeout?: ${isReactRedux ? 'NodeJS.Timeout' : 'number'} | null;
      private _connectTimeout?: ${isReactRedux ? 'NodeJS.Timeout' : 'number'} | null;
      private _pingTimeout?: ${isReactRedux ? 'NodeJS.Timeout' : 'number'} | null;
      private _pingInterval?: ${isReactRedux ? 'NodeJS.Timeout' : 'number'} | null;
      private _shouldReconnect: boolean = true;
      private _connectLock: boolean = false;
      private _closeCalled: boolean = false;
      private _shouldReconnectEventThrow: boolean = false;
      private _messageQueue: WebSocketEmitPayloadType[] = [];

      /**
       * The url parameter will be resolved before connecting, possible types:
       * string
       * () => string
       * () => Promise<string>
       *
       * Case: 1
       * const urls = ['ws://my.site.com', 'ws://your.site.com', 'ws://their.site.com'];
       * let urlIndex = 0;
       * round robin url provider
       * const urlProvider = () => urls[urlIndex++ % urls.length];
       * const ws = new WebSocketManager(urlProvider);
       *
       * Case 2
       * async url provider
       * const urlProvider = async () => {
       *  const token = await getSessionToken();
       *  return \`wss://my.site.com/\${token}\`;
       * };
       * const ws = new WebSocketManager(urlProvider);
       */
      private _url?: UrlProvider | null;
      private _protocols?: ProtocolsProvider;
      /**
       * Options = {
       *  maxReconnectionDelay?: number; // max delay in ms between reconnection
       *  minReconnectionDelay?: number; // min delay in ms between reconnection
       *  reconnectionDelayGrowFactor?: number; // how fast the reconnection delay grows
       *  minUptime?: number; // min time in ms to consider connection as stable
       *  connectionTimeout?: number; // retry connect if not connected after this time, in ms
       *  maxRetries?: number; // maximum number of retries
       *  maxEnqueuedMessages?: number; // maximum number of messages to buffer until reconnection
       *  startClosed?: boolean; // start websocket in CLOSED state, call \`.reconnect()\` to connect
       *  debug?: boolean; // enables debug output
       * };
       */
      private _options?: WebSocketOptions | null;

      /**
       * Initialization web socket and connect with server using provided configuration
       */
      public setup(
        url?: UrlProvider | null,
        protocols?: ProtocolsProvider | null,
        options?: WebSocketOptions | null
      ): void {
        this._url = url ?? '';
        this._protocols = protocols ?? undefined;
        this._options = options ?? {};
        const {
          reconnection = WEB_SOCKET_DEFAULT.reconnection,
          startClosed = WEB_SOCKET_DEFAULT.startClosed,
          autoConnect = WEB_SOCKET_DEFAULT.autoConnect
        } = this._options ?? {};
        this._shouldReconnect = reconnection ?? true;
        if (startClosed) {
          this._shouldReconnect = false;
        }

        this.debug(WebSocketManager.TAG, ['setup:', url, protocols, options]);

        if (autoConnect === true) {
          this.connect();
        }
      }

      /**
       * Returns the number or connection retries
       */
      get retryCount(): number {
        const count: number = Math.max(this._retryCount, 0);
        this.debug(WebSocketManager.TAG, ['retryCount:', count]);
        return count;
      }

      /**
       * The number of bytes of data that have been queued using calls to send() but not yet
       * transmitted to the network. This value resets to zero once all queued data has been sent.
       * This value does not reset to zero when the connection is closed; if you keep calling send(),
       * this will continue to climb. Read only
       */
      get bufferedAmount(): number {
        const bytes: number = this._messageQueue?.reduce(
          (acc: number, message?: WebSocketEmitPayloadType | null) => {
            if (message?.query !== null && message?.query !== undefined) {
              acc += JSON.stringify(message?.query).length; // not byte size
            }
            this.debug(WebSocketManager.TAG, ['bufferedAmount reduce:', acc, message]);
            return acc;
          },
          0
        );
        this.debug(WebSocketManager.TAG, ['bufferedAmount:', bytes]);
        return bytes;
      }

      /**
       * The current state of the connection; this is one of the Ready state constants
       */
      get readyState(): number {
        const { startClosed = WEB_SOCKET_DEFAULT.startClosed } = this._options ?? {};
        let state: number = WebSocketStatus.CLOSED;
        if (this._ws) {
          state = this._ws?.readyState;
        }
        if (startClosed) {
          state = WebSocketStatus.CLOSED;
        } else {
          state = WebSocketStatus.CONNECTING;
        }
        this.debug(WebSocketManager.TAG, ['readyState:', state]);
        return state;
      }

      /**
       * Whether the websocket object is now in reconnect state
       */
      get shouldReconnect(): boolean {
        this.debug(WebSocketManager.TAG, ['shouldReconnect:', this._shouldReconnect]);
        return this._shouldReconnect;
      }

      /**
       * An event listener to be called when the WebSocket connection's readyState changes to CLOSED
       */
      public onClose?: ((event: CloseEvent) => void) | null = undefined;

      /**
       * An event listener to be called when an error occurs
       */
      public onError?: ((event: ErrorEvent) => void) | null = undefined;

      /**
       * An event listener to be called when a message is received from the server
       */
      public onMessage?: ((event: MessageEvent) => void) | null = undefined;

      /**
       * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
       * this indicates that the connection is ready to send and receive data
       */
      public onOpen?: ((event: OpenEvent) => void) | null = undefined;

      /**
       * An event listener to be called when an ping interval rich
       */
      public onPing?: ((event: PingEvent) => void) | null = undefined;

      /**
       * An event listener to be called when an ping event response given by server
       */
      public onPong?: ((event: PingEvent) => void) | null = undefined;

      /**
       * An event listener to be called when an reconnect interval rich
       */
      public onReconnect?: ((event: ReconnectEvent) => void) | null = undefined;

      /**
       * An event listener to be called when an socket send request to server
       */
      public onRequest?: ((event: RequestEvent) => void) | null = undefined;

      /**
       * Get delay of reconnect web socket
       */
      private _getNextDelay(): number {
        const {
          reconnectionDelayGrowFactor = WEB_SOCKET_DEFAULT.reconnectionDelayGrowFactor,
          minReconnectionDelay = WEB_SOCKET_DEFAULT.minReconnectionDelay,
          maxReconnectionDelay = WEB_SOCKET_DEFAULT.maxReconnectionDelay
        } = this._options ?? {};
        let tempDelay: number = 0;
        if (this._retryCount > 0) {
          tempDelay =
            minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, this._retryCount - 1);
          if (tempDelay > maxReconnectionDelay) {
            tempDelay = maxReconnectionDelay;
          }
        }
        this.debug(WebSocketManager.TAG, ['_getNextDelay:', tempDelay]);
        return tempDelay;
      }

      /**
       * Wait to rich reconnect web socket delay
       */
      private _wait(): Promise<void> {
        return new Promise((resolve) => {
          setTimeout(resolve, this._getNextDelay());
        });
      }

      /**
       * Get web socket url from url provider argument
       */
      private _getNextUrl(urlProvider?: UrlProvider | null): Promise<string> {
        if (urlProvider !== null && urlProvider !== undefined && typeof urlProvider === 'string') {
          this.debug(WebSocketManager.TAG, ['_getNextUrl: string', urlProvider]);
          return Promise.resolve(urlProvider);
        }
        if (urlProvider !== null && urlProvider !== undefined && typeof urlProvider === 'function') {
          const url: string | Promise<string> = urlProvider();
          if (typeof url === 'string') {
            this.debug(WebSocketManager.TAG, ['_getNextUrl: function string', url]);
            return Promise.resolve(url);
          }
          if (url.then) {
            this.debug(WebSocketManager.TAG, ['_getNextUrl: promise', url.then]);
            return url;
          }
        }
        this.debug(WebSocketManager.TAG, ['_getNextUrl:', StringConst.WebSocketError.invalidURL]);
        throw Error(StringConst.WebSocketError.invalidURL);
      }

      /**
       * Get web socket protocols from protocols provider argument
       */
      private _getNextProtocols(
        protocolsProvider?: ProtocolsProvider | null
      ): Promise<undefined | null | string[]> {
        if (!protocolsProvider) return Promise.resolve(null);

        if (typeof protocolsProvider === 'undefined' || protocolsProvider === null) {
          this.debug(WebSocketManager.TAG, ['_getNextProtocols: undefined or null', protocolsProvider]);
          return Promise.resolve(protocolsProvider);
        }

        if (typeof protocolsProvider === 'string') {
          this.debug(WebSocketManager.TAG, ['_getNextProtocols: string', [protocolsProvider]]);
          return Promise.resolve([protocolsProvider]);
        }

        if (Array.isArray(protocolsProvider)) {
          this.debug(WebSocketManager.TAG, ['_getNextProtocols: array', protocolsProvider]);
          return Promise.resolve(protocolsProvider);
        }

        // @ts-expect-error redundant check
        if (protocolsProvider.then) {
          return (protocolsProvider as Promise<ProtocolsProvider>).then(
            (resolved: ProtocolsProvider) => {
              const temp: Promise<string[] | null | undefined> = this._getNextProtocols(resolved);
              this.debug(WebSocketManager.TAG, ['_getNextProtocols: promise', temp]);
              return temp;
            }
          );
        }

        if (typeof protocolsProvider === 'function') {
          const temp: Promise<string[] | null | undefined> = this._getNextProtocols(
            protocolsProvider() as ProtocolsProvider
          );
          this.debug(WebSocketManager.TAG, ['_getNextProtocols: function', temp]);
          return temp;
        }

        this.debug(WebSocketManager.TAG, [
          '_getNextProtocols:',
          StringConst.WebSocketError.invalidProtocols
        ]);
        throw Error(StringConst.WebSocketError.invalidProtocols);
      }

      /**
       * Get access token
       */
      private getAuthToken(): Promise<string | null | undefined> {
        return new Promise(
          // eslint-disable-next-line no-async-promise-executor
          async (
            resolve: (
              value: string | PromiseLike<string | null | undefined> | null | undefined
            ) => void,
            _reject: (reason?: any) => void
          ) => {
            const token: string | undefined = await getAccessToken();
            resolve(token ?? '');
          }
        );
      }

      /**
       * Re-Connect from web socket server or not
       */
      private get isReconnectSocket(): boolean {
        const { maxRetries = WEB_SOCKET_DEFAULT.maxRetries } = this._options ?? {};

        if (this._connectLock || !this._shouldReconnect) {
          this.debug(WebSocketManager.TAG, [
            'isReconnectSocket: lock or not reconnect',
            this._connectLock,
            !this._shouldReconnect
          ]);
        }

        if (this._retryCount >= maxRetries) {
          this.debug(WebSocketManager.TAG, [
            'isReconnectSocket: max retries reached',
            this._retryCount,
            '>=',
            maxRetries
          ]);
        }

        return !this._connectLock && this._shouldReconnect && this._retryCount < maxRetries;
      }

      /**
       * Connect from web socket server
       */
      public connect(): void {
        if (this._connectLock) {
          this.debug(WebSocketManager.TAG, ['connect: lock ', this._connectLock]);
          return;
        }
        this._connectLock = true;
        const {
          isLocal = WEB_SOCKET_DEFAULT.isLocal,
          connectionTimeout = WEB_SOCKET_DEFAULT.connectionTimeout,
          dispatchDeviceEventEmitter = WEB_SOCKET_DEFAULT.dispatchDeviceEventEmitter
        } = this._options ?? {};
        this._retryCount++;

        this.debug(WebSocketManager.TAG, ['connect: retry count', this._retryCount]);
        this._removeListeners();

        if (this.retryCount > 0) {
          const localEvent: ReconnectEvent = new ReconnectEvent(this);
          this.onReconnect?.(localEvent);
          this.dispatchEvent('reconnect', localEvent);
          if (dispatchDeviceEventEmitter) {
            DeviceEventEmitter.emit(WebSocketDeviceEventName.webSocketOnReconnect, localEvent);
          }
        }

        this._wait()
          .then(() =>
            Promise.all([
              this._getNextUrl(this._url),
              this._getNextProtocols(this._protocols || null),
              isLocal !== true ? this.getAuthToken() : Promise.resolve(undefined)
            ])
          )
          .then(
            ([url, protocols, token]: [
              string,
              string[] | null | undefined,
              string | null | undefined
            ]) => {
              this.debug(WebSocketManager.TAG, ['connect: promise', url, protocols]);
              // close could be called before creating the ws
              if (this._closeCalled) {
                this.debug(WebSocketManager.TAG, ['connect: close called', this._closeCalled]);
                this._connectLock = false;
                return;
              }

              let localURL: string = url;

              if (isLocal) {
                const { ipAddress, websocketPort } = this._options ?? {};
                localURL = \`\${url}\${ipAddress}:\${websocketPort}\`;
              } else {
                localURL = \`\${localURL}?access-token=\${token}\`;
              }

              const {
                queryParams = WEB_SOCKET_DEFAULT.queryParams,
                webSocketOptions = WEB_SOCKET_DEFAULT.webSocketOptions
              } = this._options ?? {};
              if (queryParams && size(queryParams) > 0) {
                const queryString = Object.keys(queryParams)
                  .map((key) => \`\${key}=\${queryParams?.[key]}\`)
                  .join('&');
                localURL = \`\${localURL}\${isLocal ? '?' : '&'}\${queryString}\`;
              }

              this.debug(WebSocketManager.TAG, [
                'connect: ',
                {
                  url: localURL,
                  protocols: protocols,
                  options: this._options
                }
              ]);
              this._ws = protocols
                ? new WebSocket(localURL, protocols, webSocketOptions)
                : new WebSocket(localURL, undefined, webSocketOptions);
              this._connectLock = false;
              this._addListeners();

              this._connectTimeout = setTimeout(() => this._handleConnectTimeout(), connectionTimeout);
            }
          )
          .catch((error: any) => {
            this.debug(WebSocketManager.TAG, ['connect: promise', error]);
            this._connectLock = false;
            this._handleError(new ErrorEvent(error.message, this));
          });
      }

      /**
       * Dis connect client with server
       */
      private _close(code?: number | null, reason?: string | null): void {
        this._clearTimeouts();
        if (!this._ws) {
          this.debug(WebSocketManager.TAG, ['_close: no websocket instance']);
          return;
        }
        this._removeListeners();
        try {
          if (
            this._ws?.readyState === WebSocketStatus.OPEN ||
            this._ws?.readyState === WebSocketStatus.CONNECTING
          ) {
            this.debug(WebSocketManager.TAG, ['_close: close', code, reason]);
            this._ws?.close(code ?? WebSocketCode.default, reason ?? undefined);
          }
          this._handleClose(new CloseEvent(code ?? WebSocketCode.default, reason, reason, this));
        } catch (error: unknown) {
          this.debug(WebSocketManager.TAG, ['_close: error', error]);
          this._handleError(
            // @ts-expect-error but code working fine
            new ErrorEvent(error?.message ?? StringConst.WebSocketError.disconnect, this)
          );
        }
      }

      /**
       * Closes the WebSocket connection or connection attempt, if any. If the connection is already
       * CLOSED, this method does nothing
       */
      public disconnect(code?: number | null, reason?: string | null): void {
        this._closeCalled = true;
        this._shouldReconnect = false;
        this._retryCount = 0;
        this._clearTimeouts();
        if (!this._ws) {
          this.debug(WebSocketManager.TAG, ['disconnect: no websocket instance']);
          return;
        }
        if (this._ws?.readyState === WebSocketStatus.CLOSED) {
          this.debug(WebSocketManager.TAG, ['disconnect: already websocket closed']);
          return;
        }
        this._ws?.close(code ?? WebSocketCode.default, reason ?? undefined);
        this.debug(WebSocketManager.TAG, ['disconnect: websocket closed']);
      }

      /**
       * Closes the WebSocket connection or connection attempt, if user instantly attempt disconnect after connect
       * CLOSED, this method does nothing
       */
      private get isCancelConnection(): boolean {
        if (this._closeCalled) {
          this.debug(WebSocketManager.TAG, ['isCancelConnection: already websocket cancelled']);
          this.disconnect(WebSocketCode.closeByCancel, StringConst.WebSocketError.cancel);
        }
        return this._closeCalled;
      }

      /**
       * Closes the WebSocket connection or connection attempt and connects again.
       * Resets retry counter;
       */
      public reconnect(
        code?: number | null,
        reason?: string | null,
        options?: WebSocketOptions | null
      ): void {
        this._shouldReconnect = true;
        this._closeCalled = false;
        this._retryCount = -1;
        this._shouldReconnectEventThrow = true;
        this.debug(WebSocketManager.TAG, ['reconnect:', code, reason, options]);
        if (options) {
          this._options = options;
        }
        if ((!this._ws || this._ws?.readyState === WebSocketStatus.CLOSED) && this.isReconnectSocket) {
          this.connect();
        } else if (this.isReconnectSocket) {
          this._close(code, reason);
          this.connect();
        } else {
          this.debug(WebSocketManager.TAG, [
            'reconnect: lock, not reconnect or max retries reached',
            this._connectLock,
            !this._shouldReconnect,
            this._retryCount
          ]);
        }
      }

      /**
       * Do a web socket emit if any pending message available
       */
      private resendMessageQueue(): void {
        const { resendEveryQueueItemDelay = WEB_SOCKET_DEFAULT.resendEveryQueueItemDelay } =
          this._options ?? {};
        if (resendEveryQueueItemDelay < 0) {
          this.pickNextAndResendMessage();
        } else {
          const list = [...(this._messageQueue ?? [])];
          this._messageQueue = [];
          forEach(list, (message: WebSocketEmitPayloadType) =>
            delay(this.send, resendEveryQueueItemDelay, message)
          );
        }
      }

      /**
       * Do a web socket emit if any pending message available
       */
      public pickNextAndResendMessage(): void {
        if (size(this._messageQueue) > 0) {
          const [item] = this._messageQueue.splice(0, 1);
          this.send({ ...item, isSendFromMessageQueue: true });
        }
      }

      /**
       * Enqueue specified data to be transmitted to the server over the WebSocket connection
       */
      public send(data: WebSocketEmitPayloadType, bufferOnFailure = true): boolean {
        const { bufferWhileOffline = WEB_SOCKET_DEFAULT.bufferWhileOffline } = this._options ?? {};
        this.debug(WebSocketManager.TAG, ['send:', data, bufferOnFailure]);
        if (this._ws && this._ws?.readyState === WebSocketStatus.OPEN) {
          this.debug(WebSocketManager.TAG, ['send: success', data]);
          const { dispatchDeviceEventEmitter = WEB_SOCKET_DEFAULT.dispatchDeviceEventEmitter } =
            this._options ?? {};

          //request
          const localEvent: RequestEvent = new RequestEvent(data, this);
          this.onRequest?.(localEvent);
          this.dispatchEvent('request', localEvent);
          if (dispatchDeviceEventEmitter) {
            DeviceEventEmitter.emit(WebSocketDeviceEventName.webSocketOnRequest, localEvent);
          }
          this._ws?.send(JSON.stringify(data.query));
          return true;
        } else if (bufferWhileOffline || bufferOnFailure) {
          const { maxEnqueuedMessages = WEB_SOCKET_DEFAULT.maxEnqueuedMessages } = this._options ?? {};
          if (this._messageQueue?.length < maxEnqueuedMessages) {
            this.debug(WebSocketManager.TAG, ['send: queue', data]);
            this._messageQueue?.push(data);
          }
          return false;
        }
        return false;
      }

      /**
       * The \`_sendPing\` function in TypeScript sends a ping event with custom handling and sets a timeout
       * for handling ping timeouts.
       */
      private _sendPing(): void {
        const {
          pingTimeout = WEB_SOCKET_DEFAULT.pingTimeout,
          dispatchDeviceEventEmitter = WEB_SOCKET_DEFAULT.dispatchDeviceEventEmitter
        } = this._options ?? {};
        this.debug(WebSocketManager.TAG, ['_sendPing:', pingTimeout]);

        /* Custom event */
        const localEvent: PingEvent = new PingEvent(this);
        this.onPing?.(localEvent);
        this.dispatchEvent('ping', localEvent);
        if (dispatchDeviceEventEmitter) {
          DeviceEventEmitter.emit(WebSocketDeviceEventName.webSocketOnPing, localEvent);
        }
        if (this._pingTimeout) {
          clearTimeout(this._pingTimeout ?? undefined);
        }
        this._pingTimeout = setTimeout(() => this._handlePingTimeout(), pingTimeout + 1000);
      }

      /**
       * Trigger ping event when ping interval time rich
       */
      private _handlePingInterval(): void {
        const { pingInterval = WEB_SOCKET_DEFAULT.pingInterval } = this._options ?? {};
        this._pingInterval = setInterval(() => {
          this.debug(WebSocketManager.TAG, ['_handlePingInterval:', pingInterval]);
          this._sendPing();
        }, pingInterval);
      }

      /**
       * Clear ping timeout thread
       */
      public clearPingTimeout(): void {
        if (this._pingTimeout) {
          clearTimeout(this._pingTimeout ?? undefined);
        }
      }

      /**
       * Handle timeout for server not responding to ping event
       */
      private _handlePingTimeout(): void {
        this.debug(WebSocketManager.TAG, ['_handlePingTimeout: ping timeout event']);
        this._handleError(new ErrorEvent(StringConst.WebSocketError.pingTimeout, this));
      }

      /**
       * Handle timeout for server not responding when connect with server
       */
      private _handleConnectTimeout(): void {
        this.debug(WebSocketManager.TAG, ['_handleConnectTimeout: timeout event']);
        this._handleError(new ErrorEvent(StringConst.WebSocketError.connectionTimeout, this));
      }

      /**
       * Reset retry count after up time rich
       */
      private _acceptOpen(): void {
        this._retryCount = 0;
        this.debug(WebSocketManager.TAG, ['_acceptOpen: accept open', this._retryCount]);
      }

      /**
       * Handle open event after trigger from server side
       */
      private _handleOpen = (event?: OpenEvent | null): void => {
        this.debug(WebSocketManager.TAG, ['_handleOpen:', event]);
        if (this.isCancelConnection) {
          return;
        }

        const { minUptime = WEB_SOCKET_DEFAULT.minUptime } = this._options ?? {};

        if (this._connectTimeout) {
          clearTimeout(this._connectTimeout ?? undefined);
        }
        this._uptimeTimeout = setTimeout(() => this._acceptOpen(), minUptime);

        // send enqueued messages (messages sent before websocket open event)
        this.debug(WebSocketManager.TAG, ['_handleOpen: queue', this._messageQueue]);
        if (size(this._messageQueue) > 0) {
          this.resendMessageQueue();
        }

        if (event) {
          const {
            isLocal = WEB_SOCKET_DEFAULT.isLocal,
            isSendPingAfterOpenEvent = WEB_SOCKET_DEFAULT.isSendPingAfterOpenEvent,
            dispatchDeviceEventEmitter = WEB_SOCKET_DEFAULT.dispatchDeviceEventEmitter
          } = this._options ?? {};

          this.onOpen?.(event);
          this.dispatchEvent('open', event);
          if (isSendPingAfterOpenEvent === true) {
            this._sendPing();
          }
          this._handlePingInterval();
          if (this._shouldReconnectEventThrow) {
            if (dispatchDeviceEventEmitter) {
              DeviceEventEmitter.emit(WebSocketDeviceEventName.webSocketOnAppStateChange, event);
              if (isLocal) {
                DeviceEventEmitter.emit(WebSocketDeviceEventName.webSocketOnSubscribeParams, event);
              }
            }
            this._shouldReconnectEventThrow = false;
          }
          this.debug(WebSocketManager.TAG, ['_handleOpen: event', event]);
        }
      };

      /**
       * Handle message event after trigger from server side
       */
      private _handleMessage = (event?: SocketMessageEvent | null): void => {
        this.debug(WebSocketManager.TAG, ['_handleMessage:', event]);
        if (this.isCancelConnection) {
          return;
        }

        if (this._pingInterval) {
          clearInterval(this._pingInterval ?? undefined);
        }
        this._handlePingInterval();
        const { dispatchDeviceEventEmitter = WEB_SOCKET_DEFAULT.dispatchDeviceEventEmitter } =
          this._options ?? {};

        if (event) {
          const data = JSON.parse(!isEmpty(event?.data) ? event?.data : '""');
          if (isEmpty(data)) return;
          const messageIds: string[] = (data?.messageID ?? '').split('_');
          if (size(messageIds) > 1 && isEqual(messageIds[1], 'isPing')) {
            this.clearPingTimeout();
            const localEvent: PongEvent = new PongEvent(
              JSON.stringify({ ...data, messageID: messageIds[0] }),
              { ...data, messageID: messageIds[0] },
              this
            );
            this.onPong?.(localEvent);
            this.dispatchEvent('pong', localEvent);
            if (dispatchDeviceEventEmitter) {
              DeviceEventEmitter.emit(WebSocketDeviceEventName.webSocketOnPong, localEvent);
            }
          } else {
            const localEvent: MessageEvent = new MessageEvent(event?.data, data, this);
            this.onMessage?.(localEvent);
            this.dispatchEvent('message', localEvent);
            if (data?.response === '200') {
              this.clearPingTimeout();
            }
            if (dispatchDeviceEventEmitter) {
              DeviceEventEmitter.emit(WebSocketDeviceEventName.webSocketOnMessage, localEvent);
              if (data?.response === '200') {
                DeviceEventEmitter.emit(
                  WebSocketDeviceEventName.webSocketOnMessageConnectionTrack,
                  localEvent
                );
              }
            }
          }
          this.debug(WebSocketManager.TAG, ['_handleMessage: event', event]);
        }
      };

      /**
       * Get dis connect event message from error event
       */
      private _getDisconnectMessage = (event?: ErrorEvent | null): string | undefined => {
        this.debug(WebSocketManager.TAG, ['_getDisconnectMessage:', event]);
        if (event?.message === StringConst.WebSocketError.connectionTimeout) {
          return 'timeout';
        } else if (event?.message === StringConst.WebSocketError.pingTimeout) {
          return 'ping timeout';
        }
        return event?.message ?? undefined;
      };

      /**
       * Get dis connect event code from error event
       */
      private _getDisconnectCode = (event?: ErrorEvent | null): number => {
        this.debug(WebSocketManager.TAG, ['_getDisconnectCode:', event]);
        if (event?.message === StringConst.WebSocketError.connectionTimeout) {
          return WebSocketCode.closeByConnectionTimeout;
        } else if (event?.message === StringConst.WebSocketError.pingTimeout) {
          return WebSocketCode.closeByPingTimeout;
        }
        return WebSocketCode.default;
      };

      /**
       * Handle error event after trigger from server side
       */
      private _handleError = (event?: ErrorEvent | null): void => {
        this.debug(WebSocketManager.TAG, ['_handleError:', event]);
        if (this.isCancelConnection) {
          return;
        }

        this._close(this._getDisconnectCode(event), this._getDisconnectMessage(event));
        if (this.isReconnectSocket) {
          this.connect();
        }
        const {
          isThrowEventEveryTime = WEB_SOCKET_DEFAULT.isThrowEventEveryTime,
          dispatchDeviceEventEmitter = WEB_SOCKET_DEFAULT.dispatchDeviceEventEmitter
        } = this._options ?? {};

        if (
          event &&
          (isThrowEventEveryTime ||
            !this.isReconnectSocket ||
            isEqual(event?.message, StringConst.WebSocketError.invalidURL) ||
            isEqual(event?.message, StringConst.WebSocketError.invalidProtocols))
        ) {
          this.onError?.(event);
          this.dispatchEvent('error', event);
          if (dispatchDeviceEventEmitter) {
            DeviceEventEmitter.emit(WebSocketDeviceEventName.webSocketOnError, event);
          }
          this.debug(WebSocketManager.TAG, ['_handleError: error', event]);
        }
      };

      /**
       * Handle close event after trigger from server side
       */
      private _handleClose = (event?: CloseEvent | null): void => {
        this.debug(WebSocketManager.TAG, ['_handleClose:', event]);
        if (this.isCancelConnection) {
          return;
        }

        this._clearTimeouts();
        if (this.isReconnectSocket) {
          this.connect();
        }
        const {
          isThrowEventEveryTime = WEB_SOCKET_DEFAULT.isThrowEventEveryTime,
          dispatchDeviceEventEmitter = WEB_SOCKET_DEFAULT.dispatchDeviceEventEmitter
        } = this._options ?? {};

        if (event && (isThrowEventEveryTime || !this.isReconnectSocket)) {
          this.onClose?.(event);
          this.dispatchEvent('close', event);
          if (dispatchDeviceEventEmitter) {
            DeviceEventEmitter.emit(WebSocketDeviceEventName.webSocketOnError, event);
          }
          this.debug(WebSocketManager.TAG, ['_handleClose: event', event]);
        }
      };

      /**
       * Register an event handler of a specific event type
       */
      public addEventListener<T extends keyof WebSocketEventListenerMap>(
        type: T,
        listener: WebSocketEventListenerMap[T]
      ): void {
        if (this._listeners?.[type]) {
          this.debug(WebSocketManager.TAG, [
            'addEventListener:',
            type,
            listener !== undefined && listener !== null
          ]);
          this._listeners?.[type]?.push(listener);
        }
      }

      /**
       * Removes an event listener
       */
      public removeEventListener<T extends keyof WebSocketEventListenerMap>(
        type: T,
        listener: WebSocketEventListenerMap[T]
      ): void {
        if (this._listeners?.[type]) {
          this.debug(WebSocketManager.TAG, [
            'removeEventListener:',
            type,
            listener !== undefined && listener !== null
          ]);
          this._listeners[type] = this._listeners?.[type]?.filter((callback) => callback !== listener);
        }
      }

      /**
       * Manually trigger any event
       */
      public dispatchEvent(type: keyof WebSocketEventListenerMap, event?: DispatchEventType): void {
        if (event) {
          this.debug(WebSocketManager.TAG, ['dispatchEvent:', event]);
          this._listeners?.[type]?.forEach((listener) => this._callEventListener(event, listener));
        }
      }

      /**
       * Call event listener when any event trigger
       */
      private _callEventListener<T extends keyof WebSocketEventListenerMap>(
        event?: WebSocketEventMap[T] | null,
        listener?: WebSocketEventListenerMap[T] | null
      ): void {
        if (listener && event) {
          this.debug(WebSocketManager.TAG, ['_callEventListener:', event]);
          if ('handleEvent' in listener) {
            this.debug(WebSocketManager.TAG, [
              '_callEventListener: handleEvent',
              listener?.handleEvent !== undefined && listener?.handleEvent !== null
            ]);
            // @ts-expect-error but code working fine
            listener?.handleEvent?.(event);
          } else {
            this.debug(WebSocketManager.TAG, [
              '_callEventListener: listener',
              listener !== undefined && listener !== null
            ]);
            listener?.(event);
          }
        }
      }

      /**
       * Print log in logger
       */
      public debug(name: string, args: any[]): void {
        const { isDebug = WEB_SOCKET_DEFAULT.isDebug } = this._options ?? {};
        if (isDebug) {
          logger.d([name, ...args]);
        }
      }

      /**
       * Remove all web socket listener
       */
      private _removeListeners(): void {
        if (!this._ws) {
          this.debug(WebSocketManager.TAG, ['_removeListeners: on websocket instance']);
          return;
        }
        this.debug(WebSocketManager.TAG, ['_removeListeners:']);
        this._ws?.removeEventListener('open', this._handleOpen);
        this._ws?.removeEventListener('close', this._handleClose);
        this._ws?.removeEventListener('message', this._handleMessage);
        this._ws?.removeEventListener('error', this._handleError);
      }

      /**
       * Add all web socket listener after web socket client connected
       */
      private _addListeners(): void {
        if (!this._ws) {
          this.debug(WebSocketManager.TAG, ['_addListeners: on websocket instance']);
          return;
        }
        this.debug(WebSocketManager.TAG, ['_addListeners:']);
        this._ws?.addEventListener('open', this._handleOpen);
        this._ws?.addEventListener('close', this._handleClose);
        this._ws?.addEventListener('message', this._handleMessage);
        this._ws?.addEventListener('error', this._handleError);
      }

      /**
       * Clear all timeout and interval thread
       */
      private _clearTimeouts(): void {
        this.debug(WebSocketManager.TAG, ['_clearTimeouts:']);
        if (this._connectTimeout) {
          clearTimeout(this._connectTimeout ?? undefined);
        }
        if (this._uptimeTimeout) {
          clearTimeout(this._uptimeTimeout ?? undefined);
        }
        if (this._pingTimeout) {
          clearTimeout(this._pingTimeout ?? undefined);
        }
        if (this._pingInterval) {
          clearInterval(this._pingInterval ?? undefined);
        }
      }
    }
  `;
};
