declare var DO_NOT_TRACK: string;
declare var IS_CLIENT: boolean;

const KEY: string = 'ga:user';

function encode(obj: object) {
  let k: string;
  let str: string = 'https://www.google-analytics.com/collect?v=1';

	for (k in obj) {
		if (obj[k]) {
			str += ('&' + k + '=' + encodeURIComponent(obj[k]));
		}
	}
	return str;
}

// https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
export interface InitializationOptions {
  tid: string,
  // Tracking ID – eg UA-XXXXXXXX-X
  an?: string,
  // Specifies the application's name.
  av?: string,
  // Specifies the application verison.
}
interface BaseOptions extends InitializationOptions {
  cid: string,
}

export interface RequestOptions {
  dr?: string,
  // Which referral source brought traffic to a website.

}

export default class {
  baseArguments: BaseOptions;

  constructor(options: InitializationOptions) {
    this.baseArguments = Object.assign({
      cid: (localStorage[KEY] = localStorage[KEY] || Math.random() + '.' + Math.random())
    }, options);

    if (IS_CLIENT) {
      this.send('pageview', {
        dl: location.href,
        dt: document.title
      });
    }
  }

  send(type, options) {
    if (DO_NOT_TRACK) {
      return;
    }

    new Image().src = encode(Object.assign(this.baseArguments, options, {t:type, z:Date.now()}));
  }
}