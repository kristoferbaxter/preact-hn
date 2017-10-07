import useragent from 'useragent';

function canDecodeBrotli(classification, os) {
  if (classification === 'chrome' || classification === 'firefox') {
    return true;
  } else if (classification === 'safari') {
    const osJson = os && os.toJSON();
    const osFamily = osJson.family && osJson.family.toLowerCase();

    if (osFamily === 'ios' && osJson.major >= 11) {
      return true;
    } else if (osFamily === 'mac os x' && osJson.minor >= 13) {
      return true;
    }
  }

  return false;
}

/**
 * Classify the browser based on user-agent
 * @public
 * @function classifyBrowser
 * @returns {Function}
 */
export default function classifyBrowser() {
  function userAgentClassification(req, res, next) {
    const {family, major, os} = useragent.lookup(req.headers['user-agent']);
    const lowerCaseFamily = family.toLowerCase();
    let classification = 'fallback';

    req.log.info(`user-agent: ${req.headers['user-agent']}`);
    req.log.info(`user-agent parsed: ${lowerCaseFamily}, ${major}`);

    if (lowerCaseFamily === 'chrome' || (lowerCaseFamily === 'chrome mobile' && major >= 59)) {
      classification = 'chrome';
    } else if (lowerCaseFamily === 'safari' || (lowerCaseFamily === 'mobile safari' && major >= 11)) {
      classification = 'safari';
    } else if (lowerCaseFamily === 'firefox' && major >= 55) {
      classification = 'firefox';
    } else if (lowerCaseFamily === 'edge' && major >= 15) {
      classification = 'edge';
    }

    req.userAgentClassifiction = classification;

    const brotliCapable = canDecodeBrotli(classification, os);
    req.log.info(`user-agent canDecodeBrotli: ${brotliCapable}`);
    req.canDecodeBrotli = brotliCapable;

    next();
  }

  return userAgentClassification;
}
