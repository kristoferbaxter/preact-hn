declare const DO_NOT_TRACK: string;
declare const POLYFILL_OBJECT_ASSIGN: boolean;
declare const POLYFILL_OBJECT_VALUES: boolean;
declare const POLYFILL_PROMISES: boolean;
declare const POLYFILL_FETCH: boolean;
declare const POLYFILL_URL: boolean;
declare const ALLOW_OFFLINE: boolean;
declare const IS_CLIENT: boolean;

declare var require: NodeRequire;
declare interface NodeRequire {
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
}
