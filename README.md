## Preact Hacker News Example

See this application live at: https://hn.kristoferbaxter.com

This is an example of a PWA built using Preact, Webpack, and some small opinions.
*Please do not think of this as the way to build your application*. 
Instead, view this as an example of some concepts used in modern web applications (sw, h2, h2push).

Made with _kindness_ in California. 🏄

## Installation

1. Install yarn
    * https://yarnpkg.com/en/docs/install
1. Install Brotli and Zopfli CLI
    * Typically just use 'brew', 'brew update; brew install brotli; brew install zopfli'
    * https://github.com/google/brotli
    * https://github.com/google/zopfli
2. Install Yarn Dependencies
    * yarn install
3. Run Locally
    * yarn run start (chrome only)
    * yarn run start:prod (all browsers)
4. Access using your favorite browser
    * http://localhost:22164

## Details

I've focused mostly on first initial load performance, with the small caveat of using Webpack instead of Rollup. I'd like the route based code splitting to provide a extensible model for keeping initial view rendering costs low.

In the future there are plenty of things to do:
1. Move away from needlessly spamming the Firebase API (see src/restify/storage/*) and instead leverage the firebase client in the node server.
2. Write a Webpack plugin to allow for split css files based on packages.
3. Internationalization/Localization, including RTL layout.
4. Support AppCache (even though it's kind of a jerk)
5. Allow for posting comments!
6. FIX LOTS OF BUGS! ZOMG SO MANY BUGS!
