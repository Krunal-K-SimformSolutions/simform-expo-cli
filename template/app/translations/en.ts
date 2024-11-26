import { QuestionAnswer, AppConstant } from '../../../src/index.js';

/**
 *
 */
export const ENTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isSocket = variables.isSupportFeature(AppConstant.AddFeature.Socket);

  return `
    {
      "apiError": {
        "cancelSaga": "Cancel api queue request and move forward",
        "client": "Client can not provided proper data.",
        "server": "Server side error.",
        "timeout": "Server didn't respond in time.",
        "connection": "Server not available, bad dns.",
        "network": "No internet connection, Please try again after sometime.",
        "cancel": "Request has been cancelled. Only possible if \`cancelToken\` is provided in config, see axios \`Cancellation\`.",
        "somethingWentWrong": "Something went wrong. Try again!",
        "unexpected": "An unexpected error occurred.",
        "invalidAPIInstance": "invalid {type} instance: {error}",
        "refreshAccessToken": "Unable to refresh access token for request due to token refresh error: {msg}",
        "expireRefreshToken": "Cancel request due to expiry of refresh token",
        "invalidAuthToken": "Failed to parse auth tokens {token}",
        "emptyAuthToken": "Unable to update access token since there are not tokens currently stored",
        "emptyRefreshToken": "No refresh token available",
        "failAuthToken": "Got {status} on token refresh; clearing both auth tokens",
        "failRefreshToken": "Failed to refresh auth token: {msg}",
        "failRefreshTokenParse": "Failed to refresh auth token and failed to parse error",
        "invalidRequestRefresh": "requestAccessTokenRefresh must either return a string or an object with an accessToken"
      }${isSocket ? ',' : ''}
      ${
        isSocket
          ? `"webSocketError": {
                "maxInstance": "You have reached the maximum number of 3 object references on WebSocketManager",
                "instanceRemove": "Instance already removed",
                "invalidURL": "Invalid URL",
                "invalidProtocols": "Invalid Protocols",
                "pingTimeout": "Ping Timeout",
                "connectionTimeout": "Connection Timeout",
                "disconnect": "DISCONNECT",
                "messageChannel": "Error while listening to the WebSocket message channel",
                "appStateChannel": "Error while listening to the WebSocket app state channel",
                "appStateReconnect":
                "Web socket re-connect request sent as app transitions from background to active state.",
                "appStateClose":
                "Web socket dis-connect request sent as app transitions from active to background state.",
                "netInfoChannel": "Error while listening to the WebSocket net info channel",
                "netInfoReconnect": "Web socket re-connect request sent as connection is back.",
                "netInfoClose": "Web socket dis-connect request sent as connection is loss.",
                "connected": "WebSocket connected",
                "disconnected": "WebSocket disconnected",
                "failure": "Error while connecting to the WebSocket",
                "emitFailure": "Error while emitting data to the WebSocket",
                "cancel": "Cancel websocket connection request and move forward"
              },
            `
          : ''
      }
      "common": {
        "dark": "Dark Theme",
        "light": "Light Theme",
        "en": "en",
        "hi": "hi"
      },
      "modules": {
        "notFound": {
          "title": "Oops!",
          "message": "This screen doesn't exist.",
          "home": "Go to home screen!"
        },
        "home": {
          "title": "Home",
          "message": "Welcome to the home screen."
        }
      }
    }
  `;
};
