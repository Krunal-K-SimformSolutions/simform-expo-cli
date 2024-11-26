/**
 *
 */
export const LoggerUtilsTemplate = (): string => {
  return `
    import { AppConst } from '../constants';

    const availableColors: any = {
      default: null,
      black: 30,
      red: 31,
      green: 32,
      yellow: 33,
      blue: 34,
      magenta: 35,
      cyan: 36,
      white: 37,
      grey: 90,
      redBright: 91,
      greenBright: 92,
      yellowBright: 93,
      blueBright: 94,
      magentaBright: 95,
      cyanBright: 96,
      whiteBright: 97
    };

    const resetColors = '\x1b[0m';

    /**
     * Console transport to send logs to a react native logger service
     * @param props
     *    msg: any: the message formatted by logger "[time] | [namespace] | [level] | [msg]"
     *    rawMsg: any: the message (or array of messages) in its original form
     *    level: { severity: number; text: string }: the log level
     *    extension?: string | null: its namespace if it is an extended log
     *    options?: any: the transportOptions object
     * @returns
     */
    const consoleTransport: transportFunctionType = (props) => {
      if (!props) return false;

      let msg = props.msg;
      let color;

      if (
        props.options?.colors &&
        props.options.colors[props.level.text] &&
        availableColors[props.options.colors[props.level.text]]
      ) {
        color = \`\\x1b[\${availableColors[props.options.colors[props.level.text]]}m\`;
        msg = \`\${color}\${msg}\${resetColors}\`;
      }

      if (props.extension && props.options?.extensionColors) {
        let extensionColor = '\\x1b[7m';

        if (
          props.options.extensionColors[props.extension] &&
          availableColors[props.options.extensionColors[props.extension]]
        ) {
          extensionColor = \`\\x1b[\${
            availableColors[props.options.extensionColors[props.extension]] + 10
          }m\`;
        }

        const extStart = color ? resetColors + extensionColor : extensionColor;
        const extEnd = color ? resetColors + color : resetColors;
        msg = msg.replace(props.extension, \`\${extStart} \${props.extension} \${extEnd}\`);
      }

      if (props.options?.consoleFunc) {
        props.options.consoleFunc(msg.trim());
      } else {
        // eslint-disable-next-line no-restricted-syntax
        console.log(msg.trim());
      }

      return true;
    };

    /**
     * Convert object to stringify
     * @param msg
     * @returns
     */
    const stringifyFunc = (msg: any): string => {
      let stringMsg = '';
      if (typeof msg === 'string') {
        stringMsg = msg + ' ';
      } else if (typeof msg === 'function') {
        stringMsg = '[function ' + msg.name + '()] ';
      } else if (msg && msg.stack && msg.message) {
        stringMsg = msg.message + ' ';
      } else {
        try {
          stringMsg = '\\n' + JSON.stringify(msg, null, 2) + '\\n';
        } catch {
          stringMsg += 'Undefined Message';
        }
      }
      return stringMsg;
    };

    /** Types Declaration */
    type transportFunctionType = (props: {
      msg: any;
      rawMsg: any;
      level: { severity: number; text: string };
      extension?: string | null;
      options?: any;
    }) => any;
    interface levelsType {
      [key: string]: number;
    }
    type logMethodType = (level: string, extension: string | null, ...msgs: any[]) => boolean;
    type levelLogMethodType = (...msgs: any[]) => boolean;
    interface extendedLogType {
      [key: string]: levelLogMethodType | any;
    }
    interface configLoggerType {
      severity?: string;
      transport?: transportFunctionType | transportFunctionType[];
      transportOptions?: any;
      levels?: levelsType;
      async?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      asyncFunc?: Function;
      stringifyFunc?: (msg: any) => string;
      formatFunc?: null | ((level: string, extension: string | null, msgs: any) => string);
      dateFormat?: string | ((date: Date) => string); //"time" | "local" | "utc" | "iso" | "function";
      printLevel?: boolean;
      printDate?: boolean;
      fixedExtLvlLength?: boolean;
      enabled?: boolean;
      enabledExtensions?: string[] | string | null;
    }

    /** Reserved key log string to avoid overwriting other methods or properties */
    const reservedKey: string[] = [
      'extend',
      'enable',
      'disable',
      'getExtensions',
      'setSeverity',
      'getSeverity',
      'patchConsole',
      'getOriginalConsole'
    ];

    /** Default configuration parameters for logger */
    const defaultLogger = {
      severity: 'debug',
      transport: consoleTransport,
      transportOptions: {
        colors: {
          v: 'green',
          d: 'cyan',
          i: 'blue',
          w: 'yellow',
          e: 'red',
          wtf: 'magenta'
        }
      },
      levels: {
        v: 0, // verbose
        d: 1, // debug
        i: 2, // info
        w: 3, // warn
        e: 4, // error
        wtf: 5 // what a terrible failure
      },
      async: true,
      asyncFunc: requestAnimationFrame,
      stringifyFunc: stringifyFunc,
      formatFunc: null,
      printLevel: true,
      printDate: true,
      dateFormat: 'time',
      fixedExtLvlLength: false,
      enabled: true,
      enabledExtensions: null,
      printFileLine: true,
      fileLineOffset: 0
    };

    /** Logger Main Class */
    class logs {
      private _levels: levelsType;
      private _level: string;
      private _transport: transportFunctionType | transportFunctionType[];
      private _transportOptions: any;
      private _async: boolean;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      private _asyncFunc: Function;
      private _stringifyFunc: (msg: any) => string;
      private _formatFunc?: null | ((level: string, extension: string | null, msgs: any) => string);
      private _dateFormat: string | ((date: Date) => string);
      private _printLevel: boolean;
      private _printDate: boolean;
      private _fixedExtLvlLength: boolean;
      private _enabled: boolean;
      private _enabledExtensions: string[] | null = null;
      private _disabledExtensions: string[] | null = null;
      private _extensions: string[] = [];
      private _extendedLogs: { [key: string]: extendedLogType } = {};
      private _originalConsole?: typeof console;
      private _maxLevelsChars: number = 0;
      private _maxExtensionsChars: number = 0;

      /**
       *
       * @param config
       */
      constructor(config: Required<configLoggerType>) {
        this._levels = config.levels;
        this._level = config.severity ?? Object.keys(this._levels)[0];

        this._transport = config.transport;
        this._transportOptions = config.transportOptions;

        this._asyncFunc = config.asyncFunc;
        this._async = config.async;

        this._stringifyFunc = config.stringifyFunc;
        this._formatFunc = config.formatFunc;
        this._dateFormat = config.dateFormat;
        this._printLevel = config.printLevel;
        this._printDate = config.printDate;
        this._fixedExtLvlLength = config.fixedExtLvlLength;

        this._enabled = config.enabled;

        if (Array.isArray(config.enabledExtensions)) {
          this._enabledExtensions = config.enabledExtensions;
        } else if (typeof config.enabledExtensions === 'string') {
          this._enabledExtensions = [config.enabledExtensions];
        }

        /** find max levels characters */
        if (this._fixedExtLvlLength) {
          this._maxLevelsChars = Math.max(...Object.keys(this._levels).map((k) => k.length));
        }

        /** Bind correct log levels methods */
        const that: any = this;
        Object.keys(this._levels).forEach((level: string) => {
          if (typeof level !== 'string') {
            throw Error('ERROR: levels must be strings');
          }
          if (level[0] === '_') {
            throw Error('ERROR: keys with first char "_" is reserved and cannot be used as levels');
          }
          if (reservedKey.indexOf(level) !== -1) {
            throw Error(\`ERROR: [\${level}] is a reserved key, you cannot set it as custom level\`);
          }
          if (typeof this._levels[level] === 'number') {
            that[level] = this._log.bind(this, level, null);
          } else {
            throw Error(\`ERROR: [\${level}] wrong level config\`);
          }
        }, this);
      }

      /** Log messages methods and level filter */
      private _log: logMethodType = (level, extension, ...msgs) => {
        if (this._async) {
          return this._asyncFunc(() => {
            this._sendToTransport(level, extension, msgs);
          });
        } else {
          return this._sendToTransport(level, extension, msgs);
        }
      };

      private _sendToTransport = (level: string, extension: string | null, msgs: any) => {
        if (!this._enabled) return false;
        if (!this._isLevelEnabled(level)) {
          return false;
        }
        if (extension && !this._isExtensionEnabled(extension)) {
          return false;
        }
        const msg = this._formatMsg(level, extension, msgs);
        const transportProps = {
          msg: msg,
          rawMsg: msgs,
          level: { severity: this._levels[level], text: level },
          extension: extension,
          options: this._transportOptions
        };
        if (Array.isArray(this._transport)) {
          for (let i = 0; i < this._transport.length; i++) {
            if (typeof this._transport[i] !== 'function') {
              throw Error('ERROR: transport is not a function');
            } else {
              this._transport[i](transportProps);
            }
          }
        } else {
          if (typeof this._transport !== 'function') {
            throw Error('ERROR: transport is not a function');
          } else {
            this._transport(transportProps);
          }
        }
        return true;
      };

      private _stringifyMsg = (msg: any): string => {
        return this._stringifyFunc(msg);
      };

      private _formatMsg = (level: string, extension: string | null, msgs: any): string => {
        if (typeof this._formatFunc === 'function') {
          return this._formatFunc(level, extension, msgs);
        }

        let nameTxt: string = '';
        if (extension) {
          const extStr = this._fixedExtLvlLength
            ? extension?.padEnd(this._maxExtensionsChars, ' ')
            : extension;
          nameTxt = \`\${extStr} | \`;
        }

        let dateTxt: string = '';
        if (this._printDate) {
          if (typeof this._dateFormat === 'string') {
            switch (this._dateFormat) {
              case 'time':
                dateTxt = \`\${new Date().toLocaleTimeString()} | \`;
                break;
              case 'local':
                dateTxt = \`\${new Date().toLocaleString()} | \`;
                break;
              case 'utc':
                dateTxt = \`\${new Date().toUTCString()} | \`;
                break;
              case 'iso':
                dateTxt = \`\${new Date().toISOString()} | \`;
                break;
              default:
                break;
            }
          } else if (typeof this._dateFormat === 'function') {
            dateTxt = this._dateFormat(new Date());
          }
        }

        let levelTxt = '';
        if (this._printLevel) {
          levelTxt = this._fixedExtLvlLength ? level.padEnd(this._maxLevelsChars, ' ') : level;
          levelTxt = \`\${levelTxt.toUpperCase()} : \`;
        }

        let stringMsg: string = dateTxt + nameTxt + levelTxt;

        if (Array.isArray(msgs)) {
          for (let i = 0; i < msgs.length; ++i) {
            stringMsg += this._stringifyMsg(msgs[i]);
          }
        } else {
          stringMsg += this._stringifyMsg(msgs);
        }

        return stringMsg;
      };

      /** Return true if level is enabled */
      private _isLevelEnabled = (level: string): boolean => {
        if (this._levels[level] < this._levels[this._level]) {
          return false;
        }
        return true;
      };

      /** Return true if extension is enabled */
      private _isExtensionEnabled = (extension: string): boolean => {
        if (this._disabledExtensions?.length) {
          return !this._disabledExtensions.includes(extension);
        }
        if (!this._enabledExtensions || this._enabledExtensions.includes(extension)) {
          return true;
        }
        return false;
      };

      /** Extend logger with a new extension */
      extend = (extension: string): extendedLogType => {
        if (extension === 'console') {
          throw Error(
            'ERROR: you cannot set [console] as extension, use patchConsole instead'
          );
        }
        if (this._extensions.includes(extension)) {
          return this._extendedLogs[extension];
        }
        this._extendedLogs[extension] = {};
        this._extensions.push(extension);
        const extendedLog = this._extendedLogs[extension];
        Object.keys(this._levels).forEach((level: string) => {
          extendedLog[level] = (...msgs: any) => {
            this._log(level, extension, ...msgs);
          };
          extendedLog.extend = () => {
            throw Error('ERROR: you cannot extend a logger from an already extended logger');
          };
          extendedLog.enable = () => {
            throw Error('ERROR: You cannot enable a logger from extended logger');
          };
          extendedLog.disable = () => {
            throw Error('ERROR: You cannot disable a logger from extended logger');
          };
          extendedLog.getExtensions = () => {
            throw Error('ERROR: You cannot get extensions from extended logger');
          };
          extendedLog.setSeverity = () => {
            throw Error('ERROR: You cannot set severity from extended logger');
          };
          extendedLog.getSeverity = () => {
            throw Error('ERROR: You cannot get severity from extended logger');
          };
          extendedLog.patchConsole = () => {
            throw Error('ERROR: You cannot patch console from extended logger');
          };
          extendedLog.getOriginalConsole = () => {
            throw Error('ERROR: You cannot get original console from extended logger');
          };
        });
        this._maxExtensionsChars = Math.max(...this._extensions.map((ext: string) => ext.length));
        return extendedLog;
      };

      /** Enable logger or extension */
      enable = (extension?: string): boolean => {
        if (!extension) {
          this._enabled = true;
          return true;
        }

        if (this._extensions.includes(extension)) {
          if (this._enabledExtensions) {
            if (!this._enabledExtensions.includes(extension)) {
              this._enabledExtensions.push(extension);
            }
          }
        } else {
          throw Error(\`ERROR: Extension [\${extension}] not exist\`);
        }

        if (this._disabledExtensions?.includes(extension)) {
          const extIndex = this._disabledExtensions.indexOf(extension);
          if (extIndex > -1) {
            this._disabledExtensions.splice(extIndex, 1);
          }
          if (!this._disabledExtensions.length) {
            this._disabledExtensions = null;
          }
        }

        return true;
      };

      /** Disable logger or extension */
      disable = (extension?: string): boolean => {
        if (!extension) {
          this._enabled = false;
          return true;
        }
        if (this._extensions.includes(extension)) {
          if (this._enabledExtensions) {
            const extIndex = this._enabledExtensions.indexOf(extension);
            if (extIndex > -1) {
              this._enabledExtensions.splice(extIndex, 1);
            }
            if (!this._enabledExtensions.length) {
              this._enabledExtensions = null;
            }
          }
        } else {
          throw Error(\`ERROR: Extension [\${extension}] not exist\`);
        }

        if (!this._disabledExtensions) {
          this._disabledExtensions = [];
          this._disabledExtensions.push(extension);
        } else if (!this._disabledExtensions.includes(extension)) {
          this._disabledExtensions.push(extension);
        }
        return true;
      };

      /** Return all created extensions */
      getExtensions = (): string[] => {
        return this._extensions;
      };

      /** Set log severity API */
      setSeverity = (level: string): string => {
        if (level in this._levels) {
          this._level = level;
        } else {
          throw Error(\`ERROR: Level [\${level}] not exist\`);
        }
        return this._level;
      };

      /** Get current log severity API */
      getSeverity = (): string => {
        return this._level;
      };

      /** Monkey Patch global console.log */
      patchConsole = (): void => {
        const extension = 'console';
        const levelKeys = Object.keys(this._levels);

        if (!this._originalConsole) {
          this._originalConsole = console;
        }

        if (!this._transportOptions.consoleFunc) {
          this._transportOptions.consoleFunc = this._originalConsole.log;
        }

        console.log = (...msgs: any) => {
          this._log(levelKeys[0], extension, ...msgs);
        };

        levelKeys.forEach((level: string) => {
          if ((console as any)[level]) {
            (console as any)[level] = (...msgs: any) => {
              this._log(level, extension, ...msgs);
            };
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this._originalConsole &&
              this._originalConsole.log(
                \`WARNING: "\${level}" method does not exist in console and will not be available\`
              );
          }
        });
      };
    }

    /**
     * Create a logger object. All params will take default values if not passed.
     * each levels has its level severity so we can filter logs with < and > operators
     * all subsequent levels to the one selected will be exposed (ordered by severity asc)
     * through the transport
     */
    const createLogger = <Y extends string>(config?: configLoggerType) => {
      type levelMethods<levels extends string> = {
        [key in levels]: (...args: unknown[]) => void;
      };

      type loggerType = levelMethods<Y>;

      interface extendMethods {
        extend: (extension: string) => loggerType;
      }

      const mergedConfig = { ...defaultLogger, ...config };

      return new logs(mergedConfig) as unknown as Omit<logs, 'extend'> & loggerType & extendMethods;
    };

    export const logger = createLogger<'v' | 'd' | 'i' | 'w' | 'e' | 'wtf'>(defaultLogger);
    if (!AppConst.isDevelopment) {
      logger.disable();
    }
  `;
};
