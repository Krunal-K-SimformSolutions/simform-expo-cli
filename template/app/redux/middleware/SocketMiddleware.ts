/**
 *
 */
export const SocketMiddlewareTemplate = (): string => {
  return `
    import { type EventSubscription } from 'expo-modules-core';
    import * as Network from 'expo-network';
    import { cloneDeep, has, isEmpty } from 'lodash';
    import { AppState, type AppStateStatus, type NativeEventSubscription } from 'react-native';
    import { v4 as uuidV4 } from 'uuid';
    import { ToastHolder } from '../../components';
    import { WebSocketCode, WebSocketManager } from '../../configs';
    import { StringConst } from '../../constants';
    import { ToastType } from '../../types';
    import { AppRequestActions } from '../app-request';
    import type {
      CloseEvent,
      ErrorEvent,
      MessageEvent,
      OpenEvent,
      PingEvent,
      PongEvent,
      RequestEvent,
      WebSocketEmitPayloadType,
      WebSocketEventErrorType
    } from '../../configs';
    import type { RootStateType } from '../Store';

    /**
     * Creates a middleware that handles socket connections.
     * @param {RootStateType} argStore - The store of the application.
     * @returns None
     */
    export function socketMiddleware(argStore: RootStateType) {
      const { dispatch } = argStore;

      let isInit: boolean = true;
      let subscriptionAppState: NativeEventSubscription;
      let currentAppState: AppStateStatus = AppState.currentState;
      let subscriptionNetInfo: EventSubscription;
      let currentNetInfo: Network.NetworkState;
      let queryQueue: Record<string, WebSocketEmitPayloadType | null | undefined> = {};
      const socket: WebSocketManager = WebSocketManager.getInstance('ICT');

      /**
       * The above code is a TypeScript generator function named \`handleCatchError\` that takes in two
       * parameters: \`eventType\` of type \`WebSocketEventErrorType\` and \`error\` of type \`Error\` or \`null\`.
       */
      const handleCatchError = (eventType: WebSocketEventErrorType, error?: Error | null): void => {
        if (!isEmpty(error?.message)) {
          ToastHolder.toastMessage({
            type: ToastType.fail,
            message: error?.message ?? '',
            title: '',
            interval: 2000
          });
          dispatch({
            type: eventType,
            payload: { message: error?.message ?? '' }
          });
        }
      };

      /**
       * The function \`handleAppState\` listens for changes in the app state and performs socket actions
       * based on the transitions between different app states.
       */
      const handleAppState = () => {
        socket?.debug(WebSocketManager.TAG_SAGA, ['handleAppState: ', currentAppState]);
        subscriptionAppState = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
          try {
            socket?.debug(WebSocketManager.TAG_SAGA, [
              'handleAppState: ',
              currentAppState,
              nextAppState
            ]);
            if (currentAppState?.match(/inactive|background/) && nextAppState === 'active') {
              socket?.reconnect(
                WebSocketCode.closeByAppState,
                StringConst.WebSocketError.appStateReconnect
              );
            } else if (currentAppState === 'active' && nextAppState.match(/inactive|background/)) {
              socket?.disconnect(
                WebSocketCode.closeByAppState,
                StringConst.WebSocketError.appStateClose
              );
            }
            currentAppState = nextAppState;
          } catch (error: unknown) {
            socket?.debug(WebSocketManager.TAG_SAGA, ['handleAppState: Error ', error]);
            handleCatchError(
              'APP_STATE',
              // @ts-expect-error but code working fine
              new Error(error?.message ?? StringConst.WebSocketError.appStateChannel)
            );
          }
        });
      };

      /**
       * The function \`handleNetInfo\` listens for changes in the network state and performs socket actions
       * based on the transitions between different network states.
       */
      const handleNetInfo = () => {
        socket?.debug(WebSocketManager.TAG_SAGA, ['handleNetInfo: ', currentNetInfo]);
        
        Network.getNetworkStateAsync()
          .then((state: Network.NetworkState) => {
            currentNetInfo = state;
          })
          .catch((error: any) => {
            socket?.debug(WebSocketManager.TAG_SAGA, ['handleNetInfo: Error ', error]);
            handleCatchError(
              'NET_INFO',
              new Error(error?.message ?? StringConst.WebSocketError.netInfoChannel)
            );
          });

        subscriptionNetInfo = Network.addNetworkStateListener(
          (nextNetInfo: Network.NetworkStateEvent) => {
            try {
              socket?.debug(WebSocketManager.TAG_SAGA, [
                'handleNetInfo: ',
                currentNetInfo,
                nextNetInfo
              ]);
              const prevFlag: boolean | undefined =
                currentNetInfo?.isConnected && currentNetInfo?.isInternetReachable;
              const flag: boolean | undefined =
                nextNetInfo?.isConnected && nextNetInfo?.isInternetReachable;
              if (prevFlag !== flag) {
                if (flag) {
                  socket?.reconnect(
                    WebSocketCode.closeByNetInfo,
                    StringConst.WebSocketError.netInfoReconnect
                  );
                } else {
                  socket?.disconnect(
                    WebSocketCode.closeByNetInfo,
                    StringConst.WebSocketError.netInfoClose
                  );
                }
              }
              currentNetInfo = nextNetInfo;
            } catch (error: unknown) {
              socket?.debug(WebSocketManager.TAG_SAGA, ['handleNetInfo: Error ', error]);
              handleCatchError(
                'NET_INFO',
                // @ts-expect-error but code working fine
                new Error(error?.message ?? StringConst.WebSocketError.netInfoChannel)
              );
            }
          }
        );
      };

      /**
       * The function \`handleThenResult\` processes a WebSocket payload and triggers corresponding actions
       * based on the request data.
       * @param payload - The \`handleThenResult\` function takes a \`payload\` parameter of type
       * \`Record<string, any>\`. This function performs various operations based on the data in the
       * \`payload\` object. It retrieves a request from a \`queryQueue\` based on the \`messageID\` in the
       * payload, logs
       */
      const handleThenResult = (payload: Record<string, any>) => {
        try {
          const request: WebSocketEmitPayloadType | null | undefined = cloneDeep(
            queryQueue?.[payload?.data?.messageID]
          );
          socket?.debug(WebSocketManager.TAG_SAGA, ['handleThenResult: Request ', request]);
          if (request) {
            if (request?.isContinueListening !== true) {
              delete queryQueue?.[payload?.data?.messageID];
            }
            if (request?.isSendFromMessageQueue === true) {
              socket?.pickNextAndResendMessage();
            }
          }
          const response = request?.preProcess ? request?.preProcess?.(payload?.data) : payload?.data;

          if (!isEmpty(request?.reduxActionName)) {
            dispatch({
              type: request?.reduxActionName ?? '',
              payload: { data: response }
            });
          } else if (request?.onSuccess) {
            request?.onSuccess?.(response);
          }
        } catch (error: unknown) {
          socket?.debug(WebSocketManager.TAG_SAGA, ['handleThenResult: Error ', error]);
          handleCatchError(
            'MESSAGE_RECEIVED', // @ts-expect-error but code working fine
            new Error(error?.message ?? StringConst.WebSocketError.messageChannel)
          );
        }
      };

      /**
       * The function \`handleOpen\` logs a debug message and resolves a promise with a socket object
       * when an OpenEvent occurs.
       * @param {OpenEvent} event - The \`event\` parameter in the \`handleOpen\` function is of type
       * \`OpenEvent\`. It is an event object that likely contains information related to the opening of
       * a WebSocket connection.
       */
      const handleOpen = (event: OpenEvent): void => {
        socket?.debug(WebSocketManager.TAG_SAGA, ['handleOpen: OpenEvent ', event]);
        isInit = false;
      };

      /**
       * The \`handleError\` function logs an error event, unsubscribes from a socket, and rejects a
       * promise with the error message.
       * @param {ErrorEvent} event - The \`event\` parameter in the \`handleError\` function is of type
       * \`ErrorEvent\`. It is an event object that contains information about an error that occurred.
       */
      const handleError = (event: ErrorEvent): void => {
        socket?.debug(WebSocketManager.TAG_SAGA, ['handleError: ErrorEvent ', event]);
        const defaultMessage: string = isInit ? StringConst.WebSocketError.failure : '';
        handleCatchError(
          isInit ? 'INITIALIZATION' : 'MESSAGE_RECEIVED',
          new Error(event.message ?? defaultMessage)
        );
      };

      /**
       * The \`handleClose\` function logs a CloseEvent, unsubscribes, and rejects with an error
       * containing the reason, message, or code from the event.
       * @param {CloseEvent} event - The \`event\` parameter in the \`handleClose\` function is of type
       * \`CloseEvent\`. It is an event object that represents a close event that occurs when a WebSocket
       * connection is closed.
       */
      const handleClose = (event: CloseEvent): void => {
        socket?.debug(WebSocketManager.TAG_SAGA, ['handleClose: CloseEvent ', event]);
        const defaultMessage: string = isInit ? StringConst.WebSocketError.failure : '';
        handleCatchError(
          isInit ? 'INITIALIZATION' : 'MESSAGE_RECEIVED',
          new Error(event.reason ?? event.message ?? String(event?.code ?? defaultMessage))
        );
      };

      /**
       * The function handleMessage takes a MessageEvent as a parameter, logs the event, and emits a
       * message with specific properties.
       * @param {MessageEvent} event - The \`event\` parameter in the \`handleMessage\` function is of type
       * \`MessageEvent\`. It is an object that represents a message event received by the WebSocket. In
       * this context, the function is handling the message event by logging it to the socket debug and
       * emitting a response with specific properties like
       */
      const handleMessage = (event: MessageEvent): void => {
        socket?.debug(WebSocketManager.TAG_SAGA, ['handleMessage: MessageEvent ', event]);
        handleThenResult({ data: event.result });
      };

      /**
       * The function \`handlePing\` logs a debug message and emits a ping event.
       * @param {PingEvent} event - The \`event\` parameter in the \`handlePing\` function is of type
       * \`PingEvent\`. It is used to represent an event related to a ping operation.
       */
      const handlePing = (event: PingEvent): void => {
        socket?.debug(WebSocketManager.TAG_SAGA, ['handlePing: PingEvent ', event]);
        // TODO: Provide you ping query here
        dispatch(
          AppRequestActions.emitSocket({
            query: { messageID: '' },
            isPing: true
          })
        );
      };

      /**
       * The function \`handlePong\` logs a debug message and emits a response with data from a
       * PongEvent.
       * @param {PongEvent} event - The \`event\` parameter in the \`handlePong\` function is of type
       * \`PongEvent\`. It is an object that likely contains information related to a pong event, such as
       * the result of the event.
       */
      const handlePong = (event: PongEvent): void => {
        socket?.debug(WebSocketManager.TAG_SAGA, ['handlePong: PongEvent ', event]);
        handleThenResult({ data: event.result });
      };

      /**
       * The \`handleRequest\` function logs a debug message and emits a response with specific
       * properties based on a given \`RequestEvent\`.
       * @param {RequestEvent} event - The \`event\` parameter in the \`handleRequest\` function is of type
       * \`RequestEvent\`. It is used to represent an event related to a request, and it contains
       * information such as the request itself.
       */
      const handleRequest = (event: RequestEvent): void => {
        socket?.debug(WebSocketManager.TAG_SAGA, ['handleRequest: RequestEvent ', event]);
        queryQueue = {
          ...queryQueue,
          [event?.request?.query?.messageID ?? '']: event?.request
        };
      };

      return (next: any) => (action: any) => {
        const { type, payload } = action;
        switch (type) {
          case AppRequestActions.connectSocket.toString():
            // eslint-disable-next-line no-case-declarations
            const { url, protocols, options } = payload;
            socket.disconnect();
            isInit = true;
            socket.setup(url, protocols, options);
            handleAppState();
            handleNetInfo();
            socket.addEventListener('open', handleOpen);
            socket.addEventListener('error', handleError);
            socket.addEventListener('close', handleClose);
            socket.removeEventListener('message', handleMessage);
            socket.removeEventListener('ping', handlePing);
            socket.removeEventListener('pong', handlePong);
            socket.removeEventListener('request', handleRequest);
            break;

          case AppRequestActions.disconnectSocket.toString():
            isInit = true;
            subscriptionAppState.remove();
            subscriptionNetInfo.remove();
            socket.removeEventListener('open', handleOpen);
            socket.removeEventListener('error', handleError);
            socket.removeEventListener('close', handleClose);
            socket.addEventListener('message', handleMessage);
            socket.addEventListener('ping', handlePing);
            socket.addEventListener('pong', handlePong);
            socket.addEventListener('request', handleRequest);
            socket.disconnect();
            break;

          case AppRequestActions.emitSocket.toString():
            try {
              if (!isEmpty(payload)) {
                const isPing: boolean = payload?.isPing ?? false;
                const uniqueId = \`\${uuidV4()}\${isPing ? '_isPing' : ''}\`;
                if (has(payload, 'query') || has(payload, 'query.messageID')) {
                  payload.query.messageID = uniqueId;
                } else {
                  // @ts-expect-error but code working fine
                  payload.query = { messageID: uniqueId };
                }
                // a message has been send to socket
                const isSend: boolean | undefined = socket?.send(payload);
                if (isSend === true && payload?.isEnableLossConnectionTimeout) {
                  setTimeout(() => {
                    // TODO: Show socket alert
                    // webSocketAlertRef?.current?.show()
                  }, payload?.timeoutForLossConnection ?? 15000);
                }
              }
            } catch (error: unknown) {
              handleCatchError(
                'MESSAGE_EMIT',
                // @ts-expect-error but code working fine
                new Error(error?.message ?? StringConst.WebSocketError.emitFailure)
              );
            }
            break;

          default:
            break;
        }

        return next(action);
      };
    }
  `;
};
