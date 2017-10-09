declare var DO_NOT_TRACK: string;
declare var IS_CLIENT: boolean;

const KEY: string = 'ga:user';

export const enum TransmittableBoolean {
  True = 1,
  False = 0,
}

interface InitializationOptions {
  tid: string;
  // Tracking ID – eg UA-XXXXXXXX-X
  an?: string;
  // Specifies the application's name.
  av?: string;
  // Specifies the application verison.
}
export interface BaseOptions extends InitializationOptions {
  cid: string; // TODO: Implement type definition for a v4 UUID
  // Anonymously identifies a particular user, device, or browser instance.
  // The value of this field should be a random UUID (version 4) as described in http://www.ietf.org/rfc/rfc4122.txt
  // Can we use the request id from restify/node unless one is stored locally on the device?
  // TODO: Storage should be async (IndexedDB) instead of sync localStorage going forward.
  // GA's documentation says web prefers to use a Cookie for this value.
  an: string;
  // Application Name
  av: string;
  // Application Version
}

// This is the base for options you can pass to GA on an individual request
// Do not expose this interface because we want individual requests to choose the correct shape for the type being made.
// https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
interface RequestOptions {
  t: 'pageview' | 'screenview' | 'event' | 'exception' | 'timing'; // | 'transaction' | 'item' | 'social'
  // The type of hit.
  ni?: TransmittableBoolean;
  // Specifies that a hit be considered non-interactive. (Do not count toward bounce rate)
  sr?: string;
  // Specifies the screen resolution. (i.e. 800x600)
  vp?: string;
  // Specifies the viewable area of the browser / device. (i.e. 800x600)
  sc?: 'start' | 'end';
  // Controls session duration -> 'start' forces a new session to start, 'end' forces the current session to end.
  qt?: number;
  // Used to collect offline / latent hits. The value represents the time delta (in milliseconds) between when the hit being reported occurred and the time the hit was sent.
  // We'll use this option when the application is offline, and the service worker will refire the requests from the main thread once connectivity is reestablished.
}
export interface PageViewOptions extends RequestOptions {
  //t: 'pageview',
  dl: string;
  // document location
  dt?: string;
  // document title
  dr?: string;
  // Which referral source brought traffic to a website.
}
export interface ScreenViewOptions extends RequestOptions {
  //t: 'screenview',
  linkid?: string;
  // Disambiguate different links to the same screen/page.
  cd: string;
  // screen name (used to disambiguate each screenview/pageview event)
}
export interface EventOptions extends RequestOptions {
  //t: 'event',
  ec: string;
  // Specifies the event category.
  ea: string;
  // Specifies the event action.
  el?: string;
  // Event Label
  ev?: number;
  // Event Value (must be positive)
}
export interface TimingOptions extends RequestOptions {
  //t: 'timing',
  utc: string;
  // Specifies the user timing category.
  utv: string;
  // Specifies the user timing variable.
  utt: number;
  // Specifies the user timing value. The value is in milliseconds.
  plt: number;
  // Specifies the time it took for a page to load. The value is in milliseconds.
  dns: number;
  // Specifies the time it took to do a DNS lookup.The value is in milliseconds.
  tcp: number;
  // Specifies the time it took for a TCP connection to be made. The value is in milliseconds.
  dit: number;
  // Specifies the time it took for Document.readyState to be 'interactive'. The value is in milliseconds.
}

function encode(obj: PageViewOptions | ScreenViewOptions | EventOptions | TimingOptions & {z: number}) {
  let url = new URL('https://www.google-analytics.com/collect');
  url.search = new URLSearchParams(obj as any).toString();

  return url.toString();
}

export default class {
  baseOptions: BaseOptions;

  constructor(options: InitializationOptions) {
    this.baseOptions = Object.assign(
      {
        cid: (localStorage[KEY] = localStorage[KEY] || Math.random() + '.' + Math.random()),
        an: 'PreactHN',
        av: '1.0',
      },
      options,
    );

    /*
    if (IS_CLIENT) {
      this.send('pageview', {
        dl: location.href,
        dt: document.title
      });
    }
    */
  }

  send(options: PageViewOptions | ScreenViewOptions | EventOptions | TimingOptions) {
    if (IS_CLIENT) {
      if (DO_NOT_TRACK) {
        return;
      }

      new Image().src = encode(Object.assign(this.baseOptions, options, {z: Date.now()}));
    }
  }
}
