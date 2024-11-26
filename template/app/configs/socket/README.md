# Centralized Web Socket Layer

First discuss existing Web Socket layer. As of now we all are implement every screen in web socket with redundant code. also we all are face issue because of any one can miss to add safety rule(try & catch) or add/remove event listener in their socket method.

So resolved this kind of issue in feature development that why create new Web socket layer with type safety(Typescript).

Create common web socket layer for everyone to easy access, minimum afford and well stable. In this layer we have cover native web socket object.

# API Reference

### 1. connectSocket

- Used for set custom config and connect between client and server
  ```js
  /**
   * @property {ProductName} productName - Your product name to differentiates with other instance.
   * @property {UrlProvider} url - Your socket server url.
   * @property {WebSocketOptions} options - The socket option.
   *  {
   *    @param {{ headers: { [headerName: string]: string }; [optionName: string]: any;} | null} webSocketOptions - WebSocket options
   *    @param {number} maxReconnectionDelay - Max delay in ms between reconnection
   *    @param {number} minReconnectionDelay - Min delay in ms between reconnection
   *    @param {number} reconnectionDelayGrowFactor - How fast the reconnection delay grows
   *    @param {number} minUptime - Min time in ms to consider connection as stable
   *    @param {number} connectionTimeout - Retry connect if not connected after this time, in ms
   *    @param {number} maxRetries - Maximum number of retries
   *    @param {number} maxEnqueuedMessages - Maximum number of messages to buffer until reconnection
   *    @param {boolean} startClosed - Start websocket in CLOSED state, call `.reconnect()` to connect
   *    @param {boolean} autoConnect - Whether to automatically connect upon creation. If set to false, you need to manually connect:
   *    @param {boolean} reconnection - Whether reconnection is enabled or not. If set to false, you need to manually reconnect
   *    @param {boolean} isDebug - Enables debug output
   *    @param {boolean} bufferWhileOffline - Enable message queue while socket offline
   *    @param {Record<string, any>} queryParams - Query param key pair value
   *    @param {number} pingInterval - How often to ping/pong
   *    @param {number} pingTimeout - Time after which the connection is considered timed-out
   *    @param {boolean} dispatchDeviceEventEmitter - Throw device event emitter for local broadcast
   *    @param {boolean} isThrowEventEveryTime - If true then every time getting error or close event throw data, otherwise throw after max retries reached
   *    @param {boolean} isSendPingAfterOpenEvent - If true then send ping after websocket open event trigger, otherwise not trigger
   *    @param {number} resendEveryQueueItemDelay - Throw one by one pending queue message based on provided delay interval, Default zero, if negative number then work like FIFO with wait response and pick next
   *    @param {true|false} isLocal - If true when we need to connect local web socket server
   *    @param {string|never} ipAddress - If isLocal true when you can provided local web socket server ip address, otherwise this param not available
   *    @param {number|never} websocketPort - If isLocal true when you can provided local web socket server port number, otherwise this param not available
   *  }
   * @returns based on state management middleware choose
   */
  dispatch(AppRequestActions.connectSocket({
      productName: 'ICT';
      url: 'wss://qa-api.intellicenter.com/client';
      options: {
          queryParams: { id: remoteSystem?.InstallationId }
      };
  }));
  ```

### 2. disconnectSocket

- Makes a request to the dis connect channel with web socket server.
  ```js
  /**
   * @returns based on state management middleware choose
   */
  dispatch(AppRequestActions.disconnectSocket());
  ```

### 3. emitSocket

- Makes a request to the API using Axios with the given config.
- A function that takes in an object with an api, method, path, isUnauthorized, params, data, paths, and setting property. It also takes in a source parameter.

  ```js
  /**
   * @property {WebSocketEmitPayloadType} payload - The HTTP method to use.
   * {
   *    @param {{ messageID: string } & Record<string, any>} query -  Provide your query which is throw to server
   *    @param {string} reduxActionName - Provide your redux action name if you want to save after get event response
   *    @param {(response?: Record<string, any>) => void} onSuccess - Provide callback if you want to get response in screen level
   *    @param {boolean} isPing - Used for internal purpose to send ping query
   *    @param {boolean} isSendFromMessageQueue - Used for internal purpose to send pending query
   *    @param {boolean} isContinueListening - Used for any query which is continue to throw data or subscribe query
   *    @param {boolean} isEnableLossConnectionTimeout - Used when need to identify web socket connection is available to not after query throw in some time amount
   *    @param {number} timeoutForLossConnection - Provide timeout to until wait for query response, Default 15000
   *    @param {(response?: Record<string, any>) => Record<string, any>} preProcess - Provide if you want to manipulate response before throw to redux or callback
   *  }
   * @returns based on state management middleware choose
   */
  dispatch(
    AppRequestActions.emitSocket({
      query: {
        condition: "OBJTYP = SENSE",
        objectList: [
          {
            objnam: "_A135",
            keys: [
              "OBJNAM",
              "OBJTYP",
              "PROBE",
              "STATUS",
              "SUBTYP",
              "LISTORD",
              "SNAME",
            ],
          },
        ],
        command: "GETPARAMLIST",
        messageID: "",
      },
      onSuccess: (response) => {
        this.checkAirSensor(response);
      },
    })
  );
  ```

# Example

Here provided a list of example

1. [Emit with redux action](#case-1---emit-with-redux-action)

2. [Emit with callback](#case-2---emit-with-callback)

3. [Emit with pre process and redux action](#case-3---emit-with-pre-process-and-redux-action)

4. [Emit with pre process and callback](#case-4---emit-with-pre-process-and-callback)

5. [Emit with continue listening and redux action](#case-5---emit-with-continue-listening-and-redux-action)

6. [Emit with continue listening and callback](#case-6---emit-with-continue-listening-and-callback)

7. [Emit with response timeout and redux action](#case-7---emit-with-response-timeout-and-redux-action)

8. [Emit with response timeout and callback](#case-8---emit-with-response-timeouit-and-callback)

9. [How to connect local socket server](#case-9---how-to-connect-local-socket-server)

## Case 1 - Emit with redux action

Here provided a sensor example for how to call query

- **Step 1:** Create app request reducer using toolkit (AppRequestSlice.js)

  ```js
  const INITIAL_STATE = {};

  const appRequestSlice = createSlice({
    name: "appRequest",
    initialState: INITIAL_STATE,
    reducers: {
      connectSocket: (state, action) => {},
      disconnectSocket: (state, action) => {},
      emitSocket: (state, action) => {},
    },
  });

  export const AppRequestReducer = appRequestSlice.reducer;
  export const AppRequestActions = appRequestSlice.actions;
  export const AppRequestReducerName = appRequestSlice.name;
  ```

- **Step 2:** Connect web socket client and server (App.js)

  ```js
  class Screen extends Component {
      componentDidMount() {
          const { connectSocket } = this.props;
          connectSocket?.({
              productName: 'ICT';
              url: 'wss://qa-api.intellicenter.com/client';
              options: {
                  queryParams: { id: remoteSystem?.InstallationId }
              };
          });
      }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
      connectSocket: (payload) => dispatch(AppRequestActions.connectSocket(payload))
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 3:** Create sensor reducer using toolkit (SensorSlice.js)

  ```js
  const INITIAL_STATE = {
    data: {},
  };

  const sensorSlice = createSlice({
    name: "sensor",
    initialState: INITIAL_STATE,
    reducers: {
      sensorSuccess: (state, action) => {
        state.data = action.payload.data;
      },
    },
  });

  export const SensorReducer = sensorSlice.reducer;
  export const SensorActions = sensorSlice.actions;
  export const SensorReducerName = sensorSlice.name;
  ```

- **Step 4:** Emit query to server (HomeScreen.js)

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { emitSocket } = this.props;
      emitSocket?.({
        query: {
          condition: "OBJTYP = SENSE",
          objectList: [
            {
              objnam: "_A135",
              keys: [
                "OBJNAM",
                "OBJTYP",
                "PROBE",
                "STATUS",
                "SUBTYP",
                "LISTORD",
                "SNAME",
              ],
            },
          ],
          command: "GETPARAMLIST",
          messageID: "",
        },
        reduxActionName: SensorActions.sensorSuccess.toString(),
      });
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    emitSocket: (payload) => dispatch(AppRequestActions.emitSocket(payload)),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 5:** Disconnect web socket client and server (App.js)

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { disconnectSocket } = this.props;
      disconnectSocket?.();
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    disconnectSocket: () => dispatch(AppRequestActions.disconnectSocket()),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 2 - Emit with callback

Here provided a sensor example for how to call query

- **Step 1:** Create app request reducer using toolkit (AppRequestSlice.js)

  ```js
  const INITIAL_STATE = {};

  const appRequestSlice = createSlice({
    name: "appRequest",
    initialState: INITIAL_STATE,
    reducers: {
      connectSocket: (state, action) => {},
      disconnectSocket: (state, action) => {},
      emitSocket: (state, action) => {},
    },
  });

  export const AppRequestReducer = appRequestSlice.reducer;
  export const AppRequestActions = appRequestSlice.actions;
  export const AppRequestReducerName = appRequestSlice.name;
  ```

- **Step 2:** Connect web socket client and server (App.js)

  ```js
  class Screen extends Component {
      componentDidMount() {
          const { connectSocket } = this.props;
          connectSocket?.({
              productName: 'ICT';
              url: 'wss://qa-api.intellicenter.com/client';
              options: {
                  queryParams: { id: remoteSystem?.InstallationId }
              };
          });
      }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
      connectSocket: (payload) => dispatch(AppRequestActions.connectSocket(payload))
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 3:** Emit query to server (HomeScreen.js)

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { emitSocket } = this.props;
      emitSocket?.({
        query: {
          condition: "OBJTYP = SENSE",
          objectList: [
            {
              objnam: "_A135",
              keys: [
                "OBJNAM",
                "OBJTYP",
                "PROBE",
                "STATUS",
                "SUBTYP",
                "LISTORD",
                "SNAME",
              ],
            },
          ],
          command: "GETPARAMLIST",
          messageID: "",
        },
        onSuccess: (response) => {
          this.setState({ response });
        },
      });
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    emitSocket: (payload) => dispatch(AppRequestActions.emitSocket(payload)),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 4:** Disconnect web socket client and server (App.js)

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { disconnectSocket } = this.props;
      disconnectSocket?.();
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    disconnectSocket: () => dispatch(AppRequestActions.disconnectSocket()),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 3 - Emit with pre process and redux action

Here provided a sensor example for how to call query

- **Step 1:** Create app request reducer using toolkit (AppRequestSlice.js)

  ```js
  const INITIAL_STATE = {};

  const appRequestSlice = createSlice({
    name: "appRequest",
    initialState: INITIAL_STATE,
    reducers: {
      connectSocket: (state, action) => {},
      disconnectSocket: (state, action) => {},
      emitSocket: (state, action) => {},
    },
  });

  export const AppRequestReducer = appRequestSlice.reducer;
  export const AppRequestActions = appRequestSlice.actions;
  export const AppRequestReducerName = appRequestSlice.name;
  ```

- **Step 2:** Connect web socket client and server (App.js)

  ```js
  class Screen extends Component {
      componentDidMount() {
          const { connectSocket } = this.props;
          connectSocket?.({
              productName: 'ICT';
              url: 'wss://qa-api.intellicenter.com/client';
              options: {
                  queryParams: { id: remoteSystem?.InstallationId }
              };
          });
      }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
      connectSocket: (payload) => dispatch(AppRequestActions.connectSocket(payload))
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 3:** Create sensor reducer using toolkit (SensorSlice.js)

  ```js
  const INITIAL_STATE = {
    data: {},
  };

  const sensorSlice = createSlice({
    name: "sensor",
    initialState: INITIAL_STATE,
    reducers: {
      sensorSuccess: (state, action) => {
        state.data = action.payload.data;
      },
    },
  });

  export const SensorReducer = sensorSlice.reducer;
  export const SensorActions = sensorSlice.actions;
  export const SensorReducerName = sensorSlice.name;
  ```

- **Step 4:** Emit query to server (HomeScreen.js)

  Here when get response from server, after call preProcess function and add one more key to response and return it.
  After return response call redux dispatch action and throw new return response to redux.

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { emitSocket } = this.props;
      emitSocket?.({
        query: {
          condition: "OBJTYP = SENSE",
          objectList: [
            {
              objnam: "_A135",
              keys: [
                "OBJNAM",
                "OBJTYP",
                "PROBE",
                "STATUS",
                "SUBTYP",
                "LISTORD",
                "SNAME",
              ],
            },
          ],
          command: "GETPARAMLIST",
          messageID: "",
        },
        reduxActionName: SensorActions.sensorSuccess.toString(),
        preProcess: (response) => {
          return { ...response, key: `SENSE-${response.id}` };
        },
      });
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    emitSocket: (payload) => dispatch(AppRequestActions.emitSocket(payload)),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 5:** Disconnect web socket client and server (App.js)

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { disconnectSocket } = this.props;
      disconnectSocket?.();
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    disconnectSocket: () => dispatch(AppRequestActions.disconnectSocket()),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 4 - Emit with pre process and callback

Here provided a sensor example for how to call query

- **Step 1:** Create app request reducer using toolkit (AppRequestSlice.js)

  ```js
  const INITIAL_STATE = {};

  const appRequestSlice = createSlice({
    name: "appRequest",
    initialState: INITIAL_STATE,
    reducers: {
      connectSocket: (state, action) => {},
      disconnectSocket: (state, action) => {},
      emitSocket: (state, action) => {},
    },
  });

  export const AppRequestReducer = appRequestSlice.reducer;
  export const AppRequestActions = appRequestSlice.actions;
  export const AppRequestReducerName = appRequestSlice.name;
  ```

- **Step 2:** Connect web socket client and server (App.js)

  ```js
  class Screen extends Component {
      componentDidMount() {
          const { connectSocket } = this.props;
          connectSocket?.({
              productName: 'ICT';
              url: 'wss://qa-api.intellicenter.com/client';
              options: {
                  queryParams: { id: remoteSystem?.InstallationId }
              };
          });
      }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
      connectSocket: (payload) => dispatch(AppRequestActions.connectSocket(payload))
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 3:** Emit query to server (HomeScreen.js)

  Here when get response from server, after call preProcess function and add one more key to response and return it.
  After return response call onSuccess callback and give new return response to onSuccess callback.

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { emitSocket } = this.props;
      emitSocket?.({
        query: {
          condition: "OBJTYP = SENSE",
          objectList: [
            {
              objnam: "_A135",
              keys: [
                "OBJNAM",
                "OBJTYP",
                "PROBE",
                "STATUS",
                "SUBTYP",
                "LISTORD",
                "SNAME",
              ],
            },
          ],
          command: "GETPARAMLIST",
          messageID: "",
        },
        onSuccess: (response) => {
          this.setState({ response });
        },
        preProcess: (response) => {
          return { ...response, key: `SENSE-${response.id}` };
        },
      });
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    emitSocket: (payload) => dispatch(AppRequestActions.emitSocket(payload)),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 4:** Disconnect web socket client and server (App.js)

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { disconnectSocket } = this.props;
      disconnectSocket?.();
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    disconnectSocket: () => dispatch(AppRequestActions.disconnectSocket()),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 5 - Emit with continue listening and redux action

Here provided a sensor example for how to call query

- **Step 1:** Create app request reducer using toolkit (AppRequestSlice.js)

  ```js
  const INITIAL_STATE = {};

  const appRequestSlice = createSlice({
    name: "appRequest",
    initialState: INITIAL_STATE,
    reducers: {
      connectSocket: (state, action) => {},
      disconnectSocket: (state, action) => {},
      emitSocket: (state, action) => {},
    },
  });

  export const AppRequestReducer = appRequestSlice.reducer;
  export const AppRequestActions = appRequestSlice.actions;
  export const AppRequestReducerName = appRequestSlice.name;
  ```

- **Step 2:** Connect web socket client and server (App.js)

  ```js
  class Screen extends Component {
      componentDidMount() {
          const { connectSocket } = this.props;
          connectSocket?.({
              productName: 'ICT';
              url: 'wss://qa-api.intellicenter.com/client';
              options: {
                  queryParams: { id: remoteSystem?.InstallationId }
              };
          });
      }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
      connectSocket: (payload) => dispatch(AppRequestActions.connectSocket(payload))
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 3:** Create sensor reducer using toolkit (SensorSlice.js)

  ```js
  const INITIAL_STATE = {
    data: {},
  };

  const sensorSlice = createSlice({
    name: "sensor",
    initialState: INITIAL_STATE,
    reducers: {
      sensorSuccess: (state, action) => {
        state.data = action.payload.data;
      },
    },
  });

  export const SensorReducer = sensorSlice.reducer;
  export const SensorActions = sensorSlice.actions;
  export const SensorReducerName = sensorSlice.name;
  ```

- **Step 4:** Emit query to server (HomeScreen.js)

  Here when get response from server, after throw response to redux and continue to watch next response.

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { emitSocket } = this.props;
      emitSocket?.({
        query: {
          condition: "OBJTYP = SENSE",
          objectList: [
            {
              objnam: "_A135",
              keys: [
                "OBJNAM",
                "OBJTYP",
                "PROBE",
                "STATUS",
                "SUBTYP",
                "LISTORD",
                "SNAME",
              ],
            },
          ],
          command: "GETPARAMLIST",
          messageID: "",
        },
        isContinueListening: true,
        reduxActionName: SensorActions.sensorSuccess.toString(),
      });
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    emitSocket: (payload) => dispatch(AppRequestActions.emitSocket(payload)),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 5:** Disconnect web socket client and server (App.js)

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { disconnectSocket } = this.props;
      disconnectSocket?.();
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    disconnectSocket: () => dispatch(AppRequestActions.disconnectSocket()),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 6 - Emit with continue listening and callback

Here provided a sensor example for how to call query

- **Step 1:** Create app request reducer using toolkit (AppRequestSlice.js)

  ```js
  const INITIAL_STATE = {};

  const appRequestSlice = createSlice({
    name: "appRequest",
    initialState: INITIAL_STATE,
    reducers: {
      connectSocket: (state, action) => {},
      disconnectSocket: (state, action) => {},
      emitSocket: (state, action) => {},
    },
  });

  export const AppRequestReducer = appRequestSlice.reducer;
  export const AppRequestActions = appRequestSlice.actions;
  export const AppRequestReducerName = appRequestSlice.name;
  ```

- **Step 2:** Connect web socket client and server (App.js)

  ```js
  class Screen extends Component {
      componentDidMount() {
          const { connectSocket } = this.props;
          connectSocket?.({
              productName: 'ICT';
              url: 'wss://qa-api.intellicenter.com/client';
              options: {
                  queryParams: { id: remoteSystem?.InstallationId }
              };
          });
      }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
      connectSocket: (payload) => dispatch(AppRequestActions.connectSocket(payload))
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 3:** Emit query to server (HomeScreen.js)

  Here when get response from server, after call onSuccess callback and continue to watch next response.

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { emitSocket } = this.props;
      emitSocket?.({
        query: {
          condition: "OBJTYP = SENSE",
          objectList: [
            {
              objnam: "_A135",
              keys: [
                "OBJNAM",
                "OBJTYP",
                "PROBE",
                "STATUS",
                "SUBTYP",
                "LISTORD",
                "SNAME",
              ],
            },
          ],
          command: "GETPARAMLIST",
          messageID: "",
        },
        isContinueListening: true,
        onSuccess: (response) => {
          this.setState({ response });
        },
      });
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    emitSocket: (payload) => dispatch(AppRequestActions.emitSocket(payload)),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 4:** Disconnect web socket client and server (App.js)

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { disconnectSocket } = this.props;
      disconnectSocket?.();
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    disconnectSocket: () => dispatch(AppRequestActions.disconnectSocket()),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 7 - Emit with response timeout and redux action

Here provided a sensor example for how to call query

- **Step 1:** Create app request reducer using toolkit (AppRequestSlice.js)

  ```js
  const INITIAL_STATE = {};

  const appRequestSlice = createSlice({
    name: "appRequest",
    initialState: INITIAL_STATE,
    reducers: {
      connectSocket: (state, action) => {},
      disconnectSocket: (state, action) => {},
      emitSocket: (state, action) => {},
    },
  });

  export const AppRequestReducer = appRequestSlice.reducer;
  export const AppRequestActions = appRequestSlice.actions;
  export const AppRequestReducerName = appRequestSlice.name;
  ```

- **Step 2:** Connect web socket client and server (App.js)

  ```js
  class Screen extends Component {
      componentDidMount() {
          const { connectSocket } = this.props;
          connectSocket?.({
              productName: 'ICT';
              url: 'wss://qa-api.intellicenter.com/client';
              options: {
                  queryParams: { id: remoteSystem?.InstallationId }
              };
          });
      }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
      connectSocket: (payload) => dispatch(AppRequestActions.connectSocket(payload))
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 3:** Create sensor reducer using toolkit (SensorSlice.js)

  ```js
  const INITIAL_STATE = {
    data: {},
  };

  const sensorSlice = createSlice({
    name: "sensor",
    initialState: INITIAL_STATE,
    reducers: {
      sensorSuccess: (state, action) => {
        state.data = action.payload.data;
      },
    },
  });

  export const SensorReducer = sensorSlice.reducer;
  export const SensorActions = sensorSlice.actions;
  export const SensorReducerName = sensorSlice.name;
  ```

- **Step 4:** Emit query to server (HomeScreen.js)

  Here send query to server and wait until loss connection timeout rich, if rich then cancel process.

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { emitSocket } = this.props;
      emitSocket?.({
        query: {
          condition: "OBJTYP = SENSE",
          objectList: [
            {
              objnam: "_A135",
              keys: [
                "OBJNAM",
                "OBJTYP",
                "PROBE",
                "STATUS",
                "SUBTYP",
                "LISTORD",
                "SNAME",
              ],
            },
          ],
          command: "GETPARAMLIST",
          messageID: "",
        },
        isEnableLossConnectionTimeout: true,
        timeoutForLossConnection: 10000,
        reduxActionName: SensorActions.sensorSuccess.toString(),
      });
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    emitSocket: (payload) => dispatch(AppRequestActions.emitSocket(payload)),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 5:** Disconnect web socket client and server (App.js)

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { disconnectSocket } = this.props;
      disconnectSocket?.();
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    disconnectSocket: () => dispatch(AppRequestActions.disconnectSocket()),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 8 - Emit with response timeout and callback

Here provided a sensor example for how to call query

- **Step 1:** Create app request reducer using toolkit (AppRequestSlice.js)

  ```js
  const INITIAL_STATE = {};

  const appRequestSlice = createSlice({
    name: "appRequest",
    initialState: INITIAL_STATE,
    reducers: {
      connectSocket: (state, action) => {},
      disconnectSocket: (state, action) => {},
      emitSocket: (state, action) => {},
    },
  });

  export const AppRequestReducer = appRequestSlice.reducer;
  export const AppRequestActions = appRequestSlice.actions;
  export const AppRequestReducerName = appRequestSlice.name;
  ```

- **Step 2:** Connect web socket client and server (App.js)

  ```js
  class Screen extends Component {
      componentDidMount() {
          const { connectSocket } = this.props;
          connectSocket?.({
              productName: 'ICT';
              url: 'wss://qa-api.intellicenter.com/client';
              options: {
                  queryParams: { id: remoteSystem?.InstallationId }
              };
          });
      }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
      connectSocket: (payload) => dispatch(AppRequestActions.connectSocket(payload))
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 3:** Emit query to server (HomeScreen.js)

  Here send query to server and wait until loss connection timeout rich, if rich then cancel process.

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { emitSocket } = this.props;
      emitSocket?.({
        query: {
          condition: "OBJTYP = SENSE",
          objectList: [
            {
              objnam: "_A135",
              keys: [
                "OBJNAM",
                "OBJTYP",
                "PROBE",
                "STATUS",
                "SUBTYP",
                "LISTORD",
                "SNAME",
              ],
            },
          ],
          command: "GETPARAMLIST",
          messageID: "",
        },
        isEnableLossConnectionTimeout: true,
        timeoutForLossConnection: 10000,
        onSuccess: (response) => {
          this.setState({ response });
        },
      });
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    emitSocket: (payload) => dispatch(AppRequestActions.emitSocket(payload)),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

- **Step 4:** Disconnect web socket client and server (App.js)

  ```js
  class Screen extends Component {
    componentWillUnmount() {
      const { disconnectSocket } = this.props;
      disconnectSocket?.();
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    disconnectSocket: () => dispatch(AppRequestActions.disconnectSocket()),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 9 - How to connect local web socket server

- **Step 1:** Create app request reducer using toolkit (AppRequestSlice.js)

  ```js
  const INITIAL_STATE = {};

  const appRequestSlice = createSlice({
    name: "appRequest",
    initialState: INITIAL_STATE,
    reducers: {
      connectSocket: (state, action) => {},
      disconnectSocket: (state, action) => {},
      emitSocket: (state, action) => {},
    },
  });

  export const AppRequestReducer = appRequestSlice.reducer;
  export const AppRequestActions = appRequestSlice.actions;
  export const AppRequestReducerName = appRequestSlice.name;
  ```

- **Step 2:** Connect web socket client and server (App.js)

  ```js
  class Screen extends Component {
    componentDidMount() {
      const { connectSocket } = this.props;
      connectSocket?.({
        productName: "ICT",
        url: "ws://",
        options: {
          isLocal: true,
          ipAddress: "189.68.1.0",
          websocketPort: "6680",
        },
      });
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    connectSocket: (payload) =>
      dispatch(AppRequestActions.connectSocket(payload)),
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```
