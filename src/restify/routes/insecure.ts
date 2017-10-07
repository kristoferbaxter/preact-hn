export default function upgradeInsecureRequest(req, res, next) {
  const cloudflareVisitorHeader = req.header('cf-visitor');

  if (cloudflareVisitorHeader) {
    const currentProtocol = JSON.parse(cloudflareVisitorHeader).scheme;

    if (currentProtocol === 'http') {
      const newURL = `https://${req.header('x-forwarded-host')}${req.header('forwarded-request-uri')}`;
      res.redirect(301, newURL, next);
    } else {
      next();
    }
  } else {
    next();
  }
}
