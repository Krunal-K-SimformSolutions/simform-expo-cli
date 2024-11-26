import { QuestionAnswer, AppConstant } from '../../../../src/index.js';

/**
 *
 */
export const WebSocketTypesTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isReactRedux = variables.isSupportStateManagement(AppConstant.StateManagement.ReactRedux);
  const isReduxSaga = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxSaga
  );
  const isReduxThunk = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxThunk
  );

  return `
    import { WebSocketCode } from './WebSocketConst';
    ${isReactRedux && isReduxSaga ? "import type { END, AnyAction } from 'redux-saga';" : ''}
    ${isReduxThunk ? "import type { Action } from '@reduxjs/toolkit';" : ''}

    export enum WebSocketStatus {
      CONNECTING = 0, // The connection is not yet open.
      OPEN = 1, // The connection is open and ready to communicate.
      CLOSING = 2, // The connection is in the process of closing.
      CLOSED = 3 // The connection is closed or couldn't be opened.
    }

    export type ConditionalOptions =
      | {
          isLocal?: true;
          ipAddress?: string | null;
          websocketPort?: number | null;
        }
      | {
          isLocal?: false;
          ipAddress?: never;
          websocketPort?: never;
        };

    export type Options = Partial<{
      webSocketOptions: {
        headers: { [headerName: string]: string };
        [optionName: string]: any;
      } | null; // WebSocket options
      maxReconnectionDelay: number; // max delay in ms between reconnection
      minReconnectionDelay: number; // min delay in ms between reconnection
      reconnectionDelayGrowFactor: number; // how fast the reconnection delay grows
      minUptime: number; // min time in ms to consider connection as stable
      connectionTimeout: number; // retry connect if not connected after this time, in ms
      maxRetries: number; // maximum number of retries
      maxEnqueuedMessages: number; // maximum number of messages to buffer until reconnection
      startClosed: boolean; // start websocket in CLOSED state, call \`.reconnect()\` to connect
      autoConnect: boolean; // Whether to automatically connect upon creation. If set to false, you need to manually connect:
      reconnection: boolean; // Whether reconnection is enabled or not. If set to false, you need to manually reconnect
      isDebug: boolean; // enables debug output
      bufferWhileOffline: boolean; // enable message queue while socket offline
      queryParams: Record<string, any>; // query param key pair value
      pingInterval: number; // how often to ping/pong.
      pingTimeout: number; // time after which the connection is considered timed-out.
      dispatchDeviceEventEmitter: boolean; // throw device event emitter for local broadcast
      isThrowEventEveryTime: boolean; // if true then every time getting error or close event throw data, otherwise throw after max retries reached
      isSendPingAfterOpenEvent: boolean; // if true then send ping after websocket open event trigger, otherwise not trigger
      resendEveryQueueItemDelay: number; // Throw one by one pending queue message based on provided delay interval, Default zero, if negative number then work like FIFO with wait response and pick next
    }>;

    export type WebSocketOptions = Options & ConditionalOptions;

    /**
     * The url parameter will be resolved before connecting, possible types:
     * string
     * () => string
     * () => Promise<string>
     */
    export type UrlProvider = string | (() => string) | (() => Promise<string>);

    export type ProtocolsProvider =
      | undefined
      | null
      | string
      | string[]
      | (() => undefined | null | string | string[])
      | (() => Promise<undefined | null | string | string[]>)
      | Promise<undefined | null | string | string[]>;

    export type Message = string | ArrayBuffer | Blob | ArrayBufferView;

    /**
     * The Event class in TypeScript represents an event
     * with optional target and type properties.
     */
    export class Event {
      public target?: any | null;
      public type?: string | null;
      /**
       * The constructor function initializes the type and target properties with optional parameters in
       * TypeScript.
       * @param {string | null} [type] - The \`type\` parameter in the constructor function is a string or
       * null, and it represents the type of the object being created.
       * @param {any | null} [target] - The \`target\` parameter in the constructor function is used to
       * specify the target object that the constructor is operating on. It can be any type of object or
       * value, and it is optional (hence the \`?\` in the parameter declaration).
       */
      constructor(type?: string | null, target?: any | null) {
        this.target = target;
        this.type = type;
      }
    }

    /**
     * The \`SocketMessageEvent\` class extends the \`Event\` class and
     * represents a message event with optional data.
     */
    export class SocketMessageEvent extends Event {
      public data?: any | null;
      /**
       * The constructor initializes the 'message' event with optional data and target parameters.
       * @param {any | null} [data] - The \`data\` parameter in the constructor is an optional parameter that
       * can accept any type of data or \`null\`. It is used to initialize the \`data\` property of the class
       * instance.
       * @param {any | null} [target] - The \`target\` parameter in the constructor is used to specify the
       * target of the message being created. It could be an object, element, or any other entity that the
       * message is intended for.
       */
      constructor(data?: any | null, target?: any | null) {
        super('message', target);
        this.data = data;
      }
    }

    /**
     * The \`ErrorEvent\` class in TypeScript extends the \`Event\` class
     * and includes a message property for error messages.
     */
    export class ErrorEvent extends Event {
      public message?: string | null;
      /**
       * This TypeScript constructor function initializes an error object with an optional message and
       * target.
       * @param {string | null} [message] - The \`message\` parameter in the constructor function is a string
       * that represents an error message. It is optional and can be \`null\`.
       * @param {any | null} [target] - The \`target\` parameter in the constructor is used to specify the
       * target of the error, which could be any object or value. It is passed to the superclass
       * constructor with the value \`'error'\`.
       */
      constructor(message?: string | null, target?: any | null) {
        super('error', target);
        this.message = message;
      }
    }

    /**
     * The CloseEvent class in TypeScript represents a WebSocket close
     * event with optional code, reason, message, and target parameters.
     */
    export class CloseEvent extends Event {
      public code?: number | null;
      public reason?: string | null;
      public message?: string | null;
      /**
       * The constructor initializes a WebSocket close event with optional code, reason, message, and
       * target parameters.
       * @param {number | null} [code] - The \`code\` parameter in the constructor is used to specify a
       * number that represents the reason for closing a WebSocket connection. It can be either a number or
       * null. If no code is provided, it defaults to \`WebSocketCode.default\`.
       * @param {string | null} [reason] - The \`reason\` parameter in the constructor is used to provide a
       * string that describes the reason for closing a WebSocket connection. It is optional and can be
       * passed as an argument when creating an instance of the class. If no reason is provided, the
       * default value will be an empty string.
       * @param {string | null} [message] - The \`message\` parameter in the constructor is a string that
       * represents additional information or details related to the close event being handled. It is
       * optional and defaults to an empty string if not provided.
       * @param {any | null} [target] - The \`target\` parameter in the constructor is used to specify the
       * target of the action being performed. It can be any type of value, such as an object, function, or
       * any other data type. In this case, it is passed to the superclass constructor with the event type
       * 'close'.
       */
      constructor(
        code?: number | null,
        reason?: string | null,
        message?: string | null,
        target?: any | null
      ) {
        super('close', target);
        this.code = code ?? WebSocketCode.default;
        this.reason = reason ?? '';
        this.message = message ?? '';
      }
    }

    /**
     * The MessageEvent class extends the Event class in TypeScript and includes
     * data and result properties.
     */
    export class MessageEvent extends Event {
      public data?: any | null;
      public result?: Record<string, any> | null;
      /**
       * The constructor function initializes the data and result properties with optional parameters in a
       * TypeScript class.
       * @param {any | null} [data] - The \`data\` parameter in the constructor is used to store any data
       * that needs to be passed to the class instance. It can be of any type or \`null\`.
       * @param {Record<string, any> | null} [result] - The \`result\` parameter in the constructor is of
       * type \`Record<string, any> | null\`. This means it can either be an object where the keys are
       * strings and the values can be of any type, or it can be \`null\`.
       * @param {any | null} [target] - The \`target\` parameter in the constructor is used to specify the
       * target of the message being constructed. It is passed to the superclass constructor with the value
       * \`'message'\`.
       */
      constructor(data?: any | null, result?: Record<string, any> | null, target?: any | null) {
        super('message', target);
        this.data = data;
        this.result = result;
      }
    }

    /**
     * The \`OpenEvent\` class extends the \`Event\` class in
     * TypeScript and represents an 'open' event.
     */
    export class OpenEvent extends Event {
      /**
       * The constructor function initializes an event with the type 'open' and a specified target.
       * @param {any | null} [target] - The \`target\` parameter in the constructor is an optional parameter
       * that can be of type \`any\` or \`null\`. It is used to specify the target for the event.
       */
      constructor(target?: any | null) {
        super('open', target);
      }
    }

    /**
     * The PingEvent class extends the Event class in
     * TypeScript and represents a ping event.
     */
    export class PingEvent extends Event {
      /**
       * The constructor function initializes an instance with the event type 'ping' and a target.
       * @param {any | null} [target] - The \`target\` parameter in the constructor is an optional parameter
       * that can be of type \`any\` or \`null\`. It is used to specify the target for the constructor.
       */
      constructor(target?: any | null) {
        super('ping', target);
      }
    }

    /**
     * The PongEvent class in TypeScript represents an event
     * with optional data and result properties.
     */
    export class PongEvent extends Event {
      public data?: any | null;
      public result?: Record<string, any> | null;
      /**
       * The constructor initializes the 'pong' command with optional data and result parameters.
       * @param {any | null} [data] - The \`data\` parameter in the constructor is an optional parameter that
       * can accept any type of data or \`null\`.
       * @param {Record<string, any> | null} [result] - The \`result\` parameter in the constructor is of
       * type \`Record<string, any> | null\`. This means it is expected to be an object where the keys are
       * strings and the values can be of any type, or it can be \`null\` if no result is provided.
       * @param {any | null} [target] - The \`target\` parameter in the constructor is used to specify the
       * target of the operation or action being performed. It could be an object, function, or any other
       * entity that the operation is being applied to.
       */
      constructor(data?: any | null, result?: Record<string, any> | null, target?: any | null) {
        super('pong', target);
        this.data = data;
        this.result = result;
      }
    }

    /**
     * The ReconnectEvent class extends the Event class in
     * TypeScript and represents a reconnect event.
     */
    export class ReconnectEvent extends Event {
      /**
       * The constructor function initializes a new instance with the event type 'reconnect' and a target.
       * @param {any | null} [target] - The \`target\` parameter in the constructor is an optional parameter
       * that can be of type \`any\` or \`null\`. It is used to specify the target for the reconnect action.
       */
      constructor(target?: any | null) {
        super('reconnect', target);
      }
    }

    /**
     * The \`RequestEvent\` class extends the \`Event\` class and
     * represents an event with an optional WebSocket payload.
     */
    export class RequestEvent extends Event {
      public request?: WebSocketEmitPayloadType | null;
      /**
       * This TypeScript constructor initializes a WebSocketEmitPayloadType object with optional request
       * and target parameters.
       * @param {WebSocketEmitPayloadType | null} [request] - The \`request\` parameter in the constructor is
       * of type \`WebSocketEmitPayloadType\` or \`null\`. It is used to store the payload data that will be
       * sent over a WebSocket connection.
       * @param {any | null} [target] - The \`target\` parameter in the constructor is typically used to
       * specify the object or component that the request is being sent to. It can be a WebSocket
       * connection, a specific module, or any other entity that is the intended recipient of the request.
       */
      constructor(request?: WebSocketEmitPayloadType | null, target?: any | null) {
        super('request', target);
        this.request = request;
      }
    }

    export type WebSocketEventMap = {
      close: CloseEvent;
      error: ErrorEvent;
      message: MessageEvent;
      open: OpenEvent;
      ping: PingEvent;
      pong: PongEvent;
      reconnect: ReconnectEvent;
      request: RequestEvent;
    };

    export type DispatchEventType =
      | Event
      | OpenEvent
      | MessageEvent
      | ErrorEvent
      | CloseEvent
      | PingEvent
      | PongEvent
      | ReconnectEvent
      | RequestEvent
      | null;

    export type WebSocketEventListenerMap = {
      close: (event: CloseEvent) => void | { handleEvent: (event: CloseEvent) => void };
      error: (event: ErrorEvent) => void | { handleEvent: (event: ErrorEvent) => void };
      message: (event: MessageEvent) => void | { handleEvent: (event: MessageEvent) => void };
      open: (event: OpenEvent) => void | { handleEvent: (event: OpenEvent) => void };
      ping: (event: PingEvent) => void | { handleEvent: (event: PingEvent) => void };
      pong: (event: PongEvent) => void | { handleEvent: (event: PongEvent) => void };
      reconnect: (event: ReconnectEvent) => void | { handleEvent: (event: ReconnectEvent) => void };
      request: (event: RequestEvent) => void | { handleEvent: (event: RequestEvent) => void };
    };

    export type ListenersMap = {
      error: Array<WebSocketEventListenerMap['error']>;
      message: Array<WebSocketEventListenerMap['message']>;
      open: Array<WebSocketEventListenerMap['open']>;
      close: Array<WebSocketEventListenerMap['close']>;
      ping: Array<WebSocketEventListenerMap['ping']>;
      pong: Array<WebSocketEventListenerMap['pong']>;
      reconnect: Array<WebSocketEventListenerMap['reconnect']>;
      request: Array<WebSocketEventListenerMap['request']>;
    };

    // Saga
    export type CreateWebSocketConnectionFnArgsType = {
      productName: ProductName;
      url?: UrlProvider | null;
      protocols?: ProtocolsProvider | null;
      options?: WebSocketOptions | null;
    };

    export type SocketMessageChannelResponse = {
      error?: string | null;
      data?: Record<string, any> | null;
      request?: WebSocketEmitPayloadType | null;
      ping?: boolean | null;
    };

    export type CreateWebSocketMessageChannelFnReturnType = SocketMessageChannelResponse${isReactRedux && isReduxSaga ? ' | END' : ''};

    export type SocketAppStateChannelResponse = 'onForeground' | 'onBackground' | 'OnActive';

    export type CreateWebSocketAppStateChannelFnReturnType = SocketAppStateChannelResponse${isReactRedux && isReduxSaga ? ' | END' : ''};

    export type CreateWebSocketNetInfoChannelFnReturnType = boolean | null${isReactRedux && isReduxSaga ? ' | END' : ''};

    export type ConnectPayloadType = {
      productName: ProductName;
      url: UrlProvider;
      options: WebSocketOptions;
    };

    ${!(isReactRedux && isReduxSaga) && !(isReactRedux && isReduxThunk) ? '// eslint-disable-next-line @typescript-eslint/no-empty-object-type' : ''}
    type ActionType = ${isReactRedux && isReduxSaga ? 'AnyAction' : isReactRedux && isReduxThunk ? 'Action' : '{}'};

    export type WebSocketConnectActionType = {
      payload: ConnectPayloadType;
    } & ActionType;

    export type WebSocketEventErrorType =
      | 'MESSAGE_RECEIVED'
      | 'APP_STATE'
      | 'NET_INFO'
      | 'MESSAGE_EMIT'
      | 'INITIALIZATION';

    export type ProductName = 'ICT' | 'IF3';

    export type WebSocketEmitPayloadType = {
      query: { messageID: string } & Record<string, any>; // Provide your query
      reduxActionName?: string | null; // Provide your redux action name if you want to save after get event response
      onSuccess?: ((response?: Record<string, any> | null) => void) | null; // Provide callback if you want to get response in screen level
      isPing?: boolean | null; // Used for internal purpose to send ping query
      isSendFromMessageQueue?: boolean | null; // Used for internal purpose to send pending query
      isContinueListening?: boolean | null; // Used for any query continue to throw data or subscribe query
      isEnableLossConnectionTimeout?: boolean | null; // Used when need to identify web socket connection after query throw
      timeoutForLossConnection?: number | null; // Provide timeout to until wait for query response, Default 15000
      preProcess?:
        | ((response?: Record<string, any> | null) => Record<string, any> | null | undefined)
        | null; // Provide if you want to manipulate response before throw
    };

    export type WebSocketEmitActionType = {
      payload: WebSocketEmitPayloadType;
    } & ActionType;
  `;
};
