/**
 *
 */
export const WebSocketSagaTemplate = (): string => {
  return `
    import { type EventSubscription } from 'expo-modules-core';
    import * as Network from 'expo-network';
    import { cloneDeep, has, isEmpty, isEqual } from 'lodash';
    import { AppState, type AppStateStatus, type NativeEventSubscription } from 'react-native';
    import { type EventChannel, eventChannel } from 'redux-saga';
    import {
      type CancelEffect,
      type ForkEffect,
      type PutEffect,
      type TakeEffect,
      call,
      cancel,
      cancelled,
      spawn,
      put,
      take,
      takeLatest,
      getContext,
      setContext,
      delay,
      race
    } from 'redux-saga/effects';
    import { v4 as uuidV4 } from 'uuid';
    import { ToastHolder } from '../../components';
    import { StringConst } from '../../constants';
    import { AppRequestActions } from '../../redux';
    import { ToastType } from '../../types';
    import { WebSocketCode, WebSocketSagaTypes } from './WebSocketConst';
    import WebSocketManager from './WebSocketManager';
    import type  {
      CloseEvent,
      CreateWebSocketAppStateChannelFnReturnType,
      CreateWebSocketConnectionFnArgsType,
      CreateWebSocketMessageChannelFnReturnType,
      CreateWebSocketNetInfoChannelFnReturnType,
      ErrorEvent,
      MessageEvent,
      OpenEvent,
      PingEvent,
      PongEvent,
      RequestEvent,
      SocketAppStateChannelResponse,
      SocketMessageChannelResponse,
      WebSocketConnectActionType,
      WebSocketEmitActionType,
      WebSocketEmitPayloadType,
      WebSocketEventErrorType,
      WebSocketOptions
    } from './WebSocketTypes';

    /**
     * Create web socket instance and try to connect with server
     */
    function createWebSocketConnection({
      productName,
      url,
      protocols,
      options
    }: CreateWebSocketConnectionFnArgsType): Promise<WebSocketManager> {
      return new Promise<WebSocketManager>(
        (resolve: (socket: WebSocketManager) => void, reject: (error: Error) => void) => {
          let unsubscribe: (() => void) | null | undefined;
          try {
            const socket: WebSocketManager = WebSocketManager.getInstance(productName);
            socket.setup(url, protocols, options);
            socket?.debug(WebSocketManager.TAG_SAGA, [
              'createWebSocketConnection:',
              productName,
              url,
              protocols,
              options
            ]);

            /**
             * The function \`handleOpen\` logs a debug message and resolves a promise with a socket object
             * when an OpenEvent occurs.
             * @param {OpenEvent} event - The \`event\` parameter in the \`handleOpen\` function is of type
             * \`OpenEvent\`. It is an event object that likely contains information related to the opening of
             * a WebSocket connection.
             */
            const handleOpen = (event: OpenEvent): void => {
              socket?.debug(WebSocketManager.TAG_SAGA, [
                'createWebSocketConnection: OpenEvent ',
                event
              ]);
              unsubscribe?.();
              resolve(socket);
            };

            /**
             * The \`handleError\` function logs an error event, unsubscribes from a socket, and rejects a
             * promise with the error message.
             * @param {ErrorEvent} event - The \`event\` parameter in the \`handleError\` function is of type
             * \`ErrorEvent\`. It is an event object that contains information about an error that occurred.
             */
            const handleError = (event: ErrorEvent): void => {
              socket?.debug(WebSocketManager.TAG_SAGA, [
                'createWebSocketConnection: ErrorEvent ',
                event
              ]);
              unsubscribe?.();
              reject(new Error(event.message ?? ''));
            };

            /**
             * The \`handleClose\` function logs a CloseEvent, unsubscribes, and rejects with an error
             * containing the reason, message, or code from the event.
             * @param {CloseEvent} event - The \`event\` parameter in the \`handleClose\` function is of type
             * \`CloseEvent\`. It is an event object that represents a close event that occurs when a WebSocket
             * connection is closed.
             */
            const handleClose = (event: CloseEvent): void => {
              socket?.debug(WebSocketManager.TAG_SAGA, [
                'createWebSocketConnection: CloseEvent ',
                event
              ]);
              unsubscribe?.();
              reject(new Error(event.reason ?? event.message ?? String(event?.code)));
            };

            /**
             * The \`unsubscribe\` function removes event listeners for 'open', 'error', and 'close' events
             * from the WebSocket connection, effectively stopping any further handling of these events.
             */
            unsubscribe = (): void => {
              socket.removeEventListener('open', handleOpen);
              socket.removeEventListener('error', handleError);
              socket.removeEventListener('close', handleClose);
            };

            socket.addEventListener('open', handleOpen);
            socket.addEventListener('error', handleError);
            socket.addEventListener('close', handleClose);
          } catch (error: unknown) {
            unsubscribe?.();
            // @ts-expect-error but code working fine
            reject(new Error(error?.message));
          }
        }
      );
    }

    /**
     * The above code is a TypeScript generator function named \`handleCatchError\` that takes in two
     * parameters: \`eventType\` of type \`WebSocketEventErrorType\` and \`error\` of type \`Error\` or \`null\`.
     */
    function* handleCatchError(
      eventType: WebSocketEventErrorType,
      error?: Error | null
    ): Generator<
      PutEffect<{
        type: WebSocketEventErrorType;
        payload: {
          message: string;
        };
      }>,
      void,
      unknown
    > {
      if (!isEmpty(error?.message)) {
        ToastHolder.toastMessage({
          type: ToastType.fail,
          message: error?.message ?? '',
          title: '',
          interval: 2000
        });
        yield put({
          type: eventType,
          payload: { message: error?.message ?? '' }
        });
      }
    }

    /**
     * Create and listen web socket message event
     */
    function createSocketMessageChannel(
      socket: WebSocketManager | null | undefined
    ): EventChannel<CreateWebSocketMessageChannelFnReturnType> {
      return eventChannel<CreateWebSocketMessageChannelFnReturnType>(
        (emit: (input: CreateWebSocketMessageChannelFnReturnType) => void) => {
          /**
           * The \`handleError\` function logs an error event and emits an object with error details.
           * @param {ErrorEvent} event - The \`event\` parameter in the \`handleError\` function is of type
           * \`ErrorEvent\`. It is an object that represents an error event that occurs during the execution
           * of the code.
           */
          const handleError = (event: ErrorEvent): void => {
            socket?.debug(WebSocketManager.TAG_SAGA, [
              'createSocketMessageChannel: ErrorEvent ',
              event
            ]);
            emit({
              error: event.message,
              data: undefined,
              request: undefined,
              ping: false
            });
          };

          /**
           * The \`handleClose\` function logs a CloseEvent and emits an object with error, data, request,
           * and ping properties.
           * @param {CloseEvent} event - The \`event\` parameter in the \`handleClose\` function is of type
           * \`CloseEvent\`, which is an event type that represents a close event on a WebSocket connection.
           * It contains information about the reason for the closure, such as the code, reason, and
           * message associated with the closure.
           */
          const handleClose = (event: CloseEvent): void => {
            socket?.debug(WebSocketManager.TAG_SAGA, [
              'createSocketMessageChannel: CloseEvent ',
              event
            ]);
            emit({
              error: event.reason ?? event?.message ?? String(event?.code),
              data: undefined,
              request: undefined,
              ping: false
            });
          };

          /**
           * The function handleMessage takes a MessageEvent as a parameter, logs the event, and emits a
           * message with specific properties.
           * @param {MessageEvent} event - The \`event\` parameter in the \`handleMessage\` function is of type
           * \`MessageEvent\`. It is an object that represents a message event received by the WebSocket. In
           * this context, the function is handling the message event by logging it to the socket debug and
           * emitting a response with specific properties
           */
          const handleMessage = (event: MessageEvent): void => {
            socket?.debug(WebSocketManager.TAG_SAGA, [
              'createSocketMessageChannel: MessageEvent ',
              event
            ]);
            emit({
              error: undefined,
              data: event.result,
              request: undefined,
              ping: false
            });
          };

          /**
           * The function \`handlePing\` logs a debug message and emits a ping event.
           * @param {PingEvent} event - The \`event\` parameter in the \`handlePing\` function is of type
           * \`PingEvent\`. It is used to represent an event related to a ping operation.
           */
          const handlePing = (event: PingEvent): void => {
            socket?.debug(WebSocketManager.TAG_SAGA, ['createSocketMessageChannel: PingEvent ', event]);
            emit({
              error: undefined,
              data: undefined,
              request: undefined,
              ping: true
            });
          };

          /**
           * The function \`handlePong\` logs a debug message and emits a response with data from a
           * PongEvent.
           * @param {PongEvent} event - The \`event\` parameter in the \`handlePong\` function is of type
           * \`PongEvent\`. It is an object that likely contains information related to a pong event, such as
           * the result of the event.
           */
          const handlePong = (event: PongEvent): void => {
            socket?.debug(WebSocketManager.TAG_SAGA, ['createSocketMessageChannel: PongEvent ', event]);
            emit({
              error: undefined,
              data: event.result,
              request: undefined,
              ping: false
            });
          };

          /**
           * The \`handleRequest\` function logs a debug message and emits a response with specific
           * properties based on a given \`RequestEvent\`.
           * @param {RequestEvent} event - The \`event\` parameter in the \`handleRequest\` function is of type
           * \`RequestEvent\`. It is used to represent an event related to a request, and it contains
           * information such as the request itself.
           */
          const handleRequest = (event: RequestEvent): void => {
            socket?.debug(WebSocketManager.TAG_SAGA, [
              'createSocketMessageChannel: RequestEvent ',
              event
            ]);
            emit({
              error: undefined,
              data: undefined,
              request: event?.request,
              ping: false
            });
          };

          /**
           * The \`unsubscribe\` function removes event listeners from a socket object.
           */
          const unsubscribe = (): void => {
            socket?.removeEventListener('error', handleError);
            socket?.removeEventListener('close', handleClose);
            socket?.removeEventListener('message', handleMessage);
            socket?.removeEventListener('ping', handlePing);
            socket?.removeEventListener('pong', handlePong);
            socket?.removeEventListener('request', handleRequest);
          };

          socket?.addEventListener('error', handleError);
          socket?.addEventListener('close', handleClose);
          socket?.addEventListener('message', handleMessage);
          socket?.addEventListener('ping', handlePing);
          socket?.addEventListener('pong', handlePong);
          socket?.addEventListener('request', handleRequest);
          return unsubscribe;
        }
      );
    }

    /**
     * The above code is a TypeScript generator function that watches for messages from a WebSocket
     * connection. Here is a breakdown of what the code is doing:
     */
    function* watchSocketMessages(socket: WebSocketManager | null | undefined) {
      let socketChannel: EventChannel<CreateWebSocketMessageChannelFnReturnType> | null | undefined;

      try {
        socketChannel = yield call<
          (
            socket: WebSocketManager | null | undefined
          ) => EventChannel<CreateWebSocketMessageChannelFnReturnType>
        >(createSocketMessageChannel, socket);

        while (true) {
          // wait for a message from the channel
          const payload: SocketMessageChannelResponse | null | undefined =
            yield take<SocketMessageChannelResponse>(socketChannel!);

          socket?.debug(WebSocketManager.TAG_SAGA, ['watchSocketMessages: ', payload]);
          // a message has been received, dispatch an action with the message payload
          if (payload?.ping === true) {
            // TODO: Provide you ping query here
            yield put(
              AppRequestActions.emitSocket({
                query: { messageID: '' },
                isPing: true
              })
            );
          } else if (!isEmpty(payload?.error)) {
            yield call(handleCatchError, 'MESSAGE_RECEIVED', new Error(payload?.error ?? ''));
          } else {
            const list: Record<string, WebSocketEmitPayloadType | null | undefined> =
              yield getContext('QueryQueue');
            socket?.debug(WebSocketManager.TAG_SAGA, ['watchSocketMessages: List ', list]);
            if (!isEmpty(payload?.request)) {
              yield setContext({
                QueryQueue: {
                  ...list,
                  [payload?.request?.query?.messageID ?? '']: payload?.request
                }
              });
            } else if (!isEmpty(payload?.data)) {
              const request: WebSocketEmitPayloadType | null | undefined = cloneDeep(
                list?.[payload?.data?.messageID]
              );
              socket?.debug(WebSocketManager.TAG_SAGA, ['watchSocketMessages: Request ', request]);
              if (request) {
                yield put({ type: \`\${payload?.data?.messageID}_CANCEL\` });
                if (request?.isContinueListening !== true) {
                  delete list?.[payload?.data?.messageID];
                  yield setContext({
                    QueryQueue: {
                      ...list
                    }
                  });
                }
                if (request?.isSendFromMessageQueue === true) {
                  socket?.pickNextAndResendMessage();
                }
              }
              const response = request?.preProcess
                ? request?.preProcess?.(payload?.data)
                : payload?.data;

              if (!isEmpty(request?.reduxActionName)) {
                yield put({
                  type: request?.reduxActionName ?? '',
                  payload: { data: response }
                });
              } else if (request?.onSuccess) {
                yield call(request?.onSuccess, response);
              }
            }
          }
        }
      } catch (error: unknown) {
        socket?.debug(WebSocketManager.TAG_SAGA, ['watchSocketMessages: Error ', error]);
        yield call(
          handleCatchError,
          'MESSAGE_RECEIVED',
          // @ts-expect-error but code working fine
          new Error(error?.message ?? StringConst.WebSocketError.messageChannel)
        );
      } finally {
        // @ts-expect-error but code working fine
        if (yield cancelled()) {
          yield setContext({
            QueryQueue: {}
          });
          // close the channel
          socketChannel?.close();
        }
      }
    }

    /**
     * Create and listen react native app state
     */
    function createAppStateChannel(
      socket: WebSocketManager | null | undefined,
      currentState: AppStateStatus
    ): EventChannel<CreateWebSocketAppStateChannelFnReturnType> {
      return eventChannel<CreateWebSocketAppStateChannelFnReturnType>(
        (emit: (input: CreateWebSocketAppStateChannelFnReturnType) => void) => {
          let currentAppState: AppStateStatus = currentState;

          /**
           * The function \`handleAppState\` checks the current and next app state and emits events based on
           * state transitions.
           * @param {AppStateStatus} nextAppState - NextAppState is a parameter representing the next state
           * of the application, which can have values such as 'active', 'inactive', or 'background'.
           */
          const handleAppState = (nextAppState: AppStateStatus): void => {
            socket?.debug(WebSocketManager.TAG_SAGA, [
              'createAppStateChannel: ',
              currentAppState,
              nextAppState
            ]);
            if (currentAppState?.match(/inactive|background/) && nextAppState === 'active') {
              emit('onForeground');
            } else if (currentAppState === 'active' && nextAppState.match(/inactive|background/)) {
              emit('onBackground');
            }
            currentAppState = nextAppState;
          };

          if (currentAppState === 'active') {
            emit('OnActive');
          }
          socket?.debug(WebSocketManager.TAG_SAGA, ['createAppStateChannel: ', currentAppState]);
          const subscription: NativeEventSubscription = AppState.addEventListener(
            'change',
            handleAppState
          );
          return () => {
            subscription.remove();
          };
        }
      );
    }

    /**
     * The above code is a TypeScript generator function that watches the application state changes using a
     * WebSocket connection. Here is a breakdown of what the code is doing:
     */
    function* watchAppState(socket: WebSocketManager | null | undefined) {
      let socketChannel: EventChannel<CreateWebSocketAppStateChannelFnReturnType> | null | undefined;

      try {
        socketChannel = yield call<
          (
            socket: WebSocketManager | null | undefined,
            currentState: AppStateStatus
          ) => EventChannel<CreateWebSocketAppStateChannelFnReturnType>
        >(createAppStateChannel, socket, AppState.currentState);

        while (true) {
          // wait for a message from the channel
          const payload: SocketAppStateChannelResponse | null | undefined =
            yield take<SocketAppStateChannelResponse>(socketChannel!);

          socket?.debug(WebSocketManager.TAG_SAGA, ['watchAppState: ', payload]);
          // a message has been received, dispatch an action with the message payload
          if (!isEmpty(payload) && isEqual(payload, 'onForeground')) {
            socket?.reconnect(
              WebSocketCode.closeByAppState,
              StringConst.WebSocketError.appStateReconnect
            );
          } else if (!isEmpty(payload) && isEqual(payload, 'onBackground')) {
            socket?.disconnect(WebSocketCode.closeByAppState, StringConst.WebSocketError.appStateClose);
          }
        }
      } catch (error: unknown) {
        socket?.debug(WebSocketManager.TAG_SAGA, ['watchAppState: Error ', error]);
        yield call(
          handleCatchError,
          'APP_STATE',
          // @ts-expect-error but code working fine
          new Error(error?.message ?? StringConst.WebSocketError.appStateChannel)
        );
      } finally {
        // @ts-expect-error but code working fine
        if (yield cancelled()) {
          // close the channel
          socketChannel?.close();
        }
      }
    }

    /**
     * Create and listen net info
     */
    function createSocketNetInfoChannel(
      socket: WebSocketManager | null | undefined,
      currentInfo: Network.NetworkState
    ): EventChannel<CreateWebSocketNetInfoChannelFnReturnType> {
      return eventChannel<CreateWebSocketNetInfoChannelFnReturnType>(
        (emit: (input: CreateWebSocketNetInfoChannelFnReturnType) => void) => {
          let currentNetInfo: Network.NetworkState = currentInfo;

          /**
           * The function \`handleNetInfo\` checks for changes in network connectivity and emits a flag if
           * there is a change.
           * @param {NetInfoState} nextNetInfo - NextNetInfo is an object that represents the current
           * network information state. It contains properties such as isConnected (boolean) and
           * isInternetReachable (boolean) to indicate the network connectivity status.
           */
          const handleNetInfo = (nextNetInfo: Network.NetworkState): void => {
            socket?.debug(WebSocketManager.TAG_SAGA, [
              'createSocketNetInfoChannel: ',
              currentNetInfo,
              nextNetInfo
            ]);
            const prevFlag: boolean | undefined =
              currentNetInfo?.isConnected && currentNetInfo?.isInternetReachable;
            const flag: boolean | undefined =
              nextNetInfo?.isConnected && nextNetInfo?.isInternetReachable;
            if (flag && prevFlag !== flag) {
              emit(flag);
            }
            currentNetInfo = nextNetInfo;
          };

          // TODO: If need to re-connect when initialization time
          // emit(isConnected)
          socket?.debug(WebSocketManager.TAG_SAGA, ['createSocketNetInfoChannel: ', currentNetInfo]);
          const subscription: EventSubscription = Network.addNetworkStateListener(handleNetInfo);
          return () => {
            subscription.remove();
          };
        }
      );
    }

    /**
     * The above code is a TypeScript generator function that watches for changes in network information
     * using the NetInfo API. Here is a breakdown of what the code is doing:
     */
    function* watchNetInfo(socket: WebSocketManager | null | undefined) {
      let socketChannel: EventChannel<CreateWebSocketNetInfoChannelFnReturnType> | null | undefined;

      try {
        const currentNetInfo: Network.NetworkState = yield Network.getNetworkStateAsync();

        socketChannel = yield call<
          (
            socket: WebSocketManager | null | undefined,
            currentNetInfo: Network.NetworkState
          ) => EventChannel<CreateWebSocketNetInfoChannelFnReturnType>
        >(createSocketNetInfoChannel, socket, currentNetInfo);

        while (true) {
          // wait for a message from the channel
          const payload: boolean | null | undefined = yield take<boolean | null>(socketChannel!);

          socket?.debug(WebSocketManager.TAG_SAGA, ['watchNetInfo: ', payload]);
          // a message has been received, dispatch an action with the message payload
          if (payload === true) {
            socket?.reconnect(
              WebSocketCode.closeByNetInfo,
              StringConst.WebSocketError.netInfoReconnect
            );
          } else if (payload === false) {
            socket?.disconnect(WebSocketCode.closeByNetInfo, StringConst.WebSocketError.netInfoClose);
          }
        }
      } catch (error: unknown) {
        socket?.debug(WebSocketManager.TAG_SAGA, ['watchNetInfo: Error ', error]);
        yield call(
          handleCatchError,
          'NET_INFO',
          // @ts-expect-error but code working fine
          new Error(error?.message ?? StringConst.WebSocketError.netInfoChannel)
        );
      } finally {
        // @ts-expect-error but code working fine
        if (yield cancelled()) {
          // close the channel
          socketChannel?.close();
        }
      }
    }

    /**
     * Wait unit delay rich and if response not get then show
     * web socket connection lost, otherwise cancel task
     */
    function* watchSendMessageTimeOut(
      socket: WebSocketManager | null | undefined,
      timeoutForLossConnection?: number | null
    ) {
      socket?.debug(WebSocketManager.TAG_SAGA, [
        'watchSendMessageTimeOut: ',
        timeoutForLossConnection ?? 15000
      ]);
      yield delay(timeoutForLossConnection ?? 15000);
      // TODO: Show socket alert
      // webSocketAlertRef?.current?.show()
    }

    /**
     * Prepare request and emit to websocket
     * {
     *    type: WebSocketSagaTypes.WEB_SOCKET_EMIT,
     *    payload: {
     *      query: {
     *        // TODO: Other keys based on query builder
     *        messageID: '',
     *      },
     *      reduxActionName: '',
     *      onSuccess: (response: Record<string, any>) => {}
     *      productName: ''
     *    }
     * }
     */
    function* watchSendMessage(socket: WebSocketManager | null | undefined) {
      try {
        while (true) {
          // wait for a message
          const { payload }: WebSocketEmitActionType = yield take(
            AppRequestActions.emitSocket.toString()
          );

          socket?.debug(WebSocketManager.TAG_SAGA, ['watchSendMessage: ', payload]);
          if (!isEmpty(payload)) {
            const isPing: boolean = payload?.isPing ?? false;
            const uniqueId = \`\${uuidV4()}\${isPing ? '_isPing' : ''}\`;
            if (has(payload, 'query') || has(payload, 'query.messageID')) {
              payload.query.messageID = uniqueId;
            } else {
              payload.query = { messageID: uniqueId };
            }
            // a message has been send to socket
            const isSend: boolean | undefined = socket?.send(payload);
            if (isSend === true && payload?.isEnableLossConnectionTimeout) {
              yield race([
                call(watchSendMessageTimeOut, socket, payload?.timeoutForLossConnection),
                take(\`\${payload.query.messageID}_CANCEL\`)
              ]);
            }
          }
        }
      } catch (error: unknown) {
        socket?.debug(WebSocketManager.TAG_SAGA, ['watchSendMessage: Error ', error]);
        yield call(
          handleCatchError,
          'MESSAGE_EMIT',
          // @ts-expect-error but code working fine
          new Error(error?.message ?? StringConst.WebSocketError.emitFailure)
        );
      }
    }

    /**
     * Create web socket instance and watch all channel
     */
    function* initSocketAndListen(action: WebSocketConnectActionType) {
      let socket: WebSocketManager | null | undefined;
      const socketTask: Array<ForkEffect<unknown> | null | undefined> = [];

      try {
        const { productName, url, options } = action.payload;

        const localOption: WebSocketOptions = {
          isDebug: true,
          ...options
        };

        socket = yield call<(args: CreateWebSocketConnectionFnArgsType) => Promise<WebSocketManager>>(
          createWebSocketConnection,
          {
            productName: productName,
            url: url,
            protocols: undefined,
            options: localOption
          }
        );

        yield put({
          type: WebSocketSagaTypes.WEB_SOCKET_STATUS,
          payload: { message: StringConst.WebSocketError.connected }
        });

        socket?.debug(WebSocketManager.TAG_SAGA, [
          'initSocketAndListen: ',
          productName,
          url,
          localOption
        ]);
        socketTask.push(yield spawn(watchSocketMessages, socket));
        socketTask.push(yield spawn(watchAppState, socket));
        socketTask.push(yield spawn(watchSendMessage, socket));
        socketTask.push(yield spawn(watchNetInfo, socket));
      } catch (error: unknown) {
        socket?.debug(WebSocketManager.TAG_SAGA, ['initSocketAndListen: Error ', error]);
        yield call(
          handleCatchError,
          'INITIALIZATION',
          // @ts-expect-error but code working fine
          new Error(error?.message ?? StringConst.WebSocketError.failure)
        );
      } finally {
        // @ts-expect-error but code working fine
        if (yield cancelled()) {
          // close the WebSocket connection
          for (const task of socketTask) {
            if (task) {
              // @ts-expect-error but code working fine
              yield cancel(task);
            }
          }
          socket?.disconnect();
          WebSocketManager.removeInstance(action.payload.productName);
        }
      }
    }

    /**
     * Create web socket instance and watch disconnect event
     */
    function* watchWebSocketConnect(action: WebSocketConnectActionType): Generator<
      | ForkEffect<void>
      | CancelEffect
      | TakeEffect
      | PutEffect<{
          type: string;
          payload: { message: string };
        }>,
      void,
      unknown
    > {
      // starts the task in the background
      const socketTask = yield spawn(initSocketAndListen, action);
      // when DISCONNECT action is dispatched, we cancel the socket task
      yield take([AppRequestActions.disconnectSocket.toString()]);
      // @ts-expect-error but code working fine
      yield cancel(socketTask);
      const socket: WebSocketManager = WebSocketManager.getInstance('ICT');
      socket?.disconnect();
      yield put({
        type: WebSocketSagaTypes.WEB_SOCKET_STATUS,
        payload: { message: StringConst.WebSocketError.disconnected }
      });
    }

    export default [takeLatest(AppRequestActions.connectSocket.toString(), watchWebSocketConnect)];
  `;
};
