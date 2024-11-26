export const StringConstTemplate = (): string => {
  return `
    /**
     * An object that contains all of the possible error messages that can be returned by the API.
     */
    const ApiError = Object.freeze({
      network: 'apiError:msgNetworkError',
      server: 'apiError:msgServerError',
      somethingWentWrong: 'apiError:msgSomethingWentWrong',
      cancelSaga: 'apiError:msgCancelSagaError',
      timeout: 'apiError:msgTimeoutError',
      client: 'apiError:msgClientError',
      cancel: 'apiError:msgCancelError',
      connection: 'apiError:msgConnectionError',
      unexpected: 'apiError:msgUnexpectedError',
      invalidAPIInstance: 'apiError:msgInvalidAPIInstanceError',
      refreshAccessToken: 'apiError:msgRefreshAccessTokenError',
      expireRefreshToken: 'apiError:msgExpireRefreshTokenError',
      invalidAuthToken: 'apiError:msgInvalidAuthTokenError',
      emptyAuthToken: 'apiError:msgEmptyAuthTokenError',
      emptyRefreshToken: 'apiError:msgEmptyRefreshTokenError',
      failAuthToken: 'apiError:msgFailAuthTokenError',
      failRefreshToken: 'apiError:msgFailRefreshTokenError',
      failRefreshTokenParse: 'apiError:msgFailRefreshTokenParseError',
      invalidRequestRefresh: 'apiError:msgInvalidRequestRefreshError'
    });

    /**
     * An object that contains all of the possible error messages that can be returned by the Socket.
     */
    export const WebSocketError = Object.freeze({
      maxInstance: 'webSocketError:msgMaxInstance',
      instanceRemove: 'webSocketError:msgInstanceRemove',
      invalidURL: 'webSocketError:msgInvalidURL',
      invalidProtocols: 'webSocketError:msgInvalidProtocols',
      pingTimeout: 'webSocketError:msgPingTimeout',
      connectionTimeout: 'webSocketError:msgConnectionTimeout',
      disconnect: 'webSocketError:msgDisconnect',
      messageChannel: 'webSocketError:msgMessageChannel',
      appStateChannel: 'webSocketError:msgAppStateChannel',
      appStateReconnect: 'webSocketError:msgAppStateReconnect',
      appStateClose: 'webSocketError:msgAppStateClose',
      netInfoChannel: 'webSocketError:msgNetInfoChannel',
      netInfoReconnect: 'webSocketError:msgNetInfoReconnect',
      netInfoClose: 'webSocketError:msgNetInfoClose',
      connected: 'webSocketError:msgConnected',
      disconnected: 'webSocketError:msgDisconnected',
      failure: 'webSocketError:msgFailure',
      emitFailure: 'webSocketError:msgEmitFailure',
      cancel: 'webSocketError:msgCancel'

    });

    /**
     * Exporting all the strings in one object..
     * Separate string object like Home, Setting & Auth etc...
     * base on your modules dir structure
     */
    export default Object.freeze({
      ApiError,
      WebSocketError,
      // YupError,
      // Message,
      // Components,
      // Auth
    });
  `;
};
