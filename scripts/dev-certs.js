const chalk = require('chalk');
const getDevelopmentCertificate = require('devcert-with-localhost').default;
const fs = require('fs');
const path = require('path');

const PRIVATE_FOLDER_PATH = path.join(__dirname, '..', 'proxy');
const CERT_KEY_PATH = path.join(PRIVATE_FOLDER_PATH, 'key.pem');
const CERT_PATH = path.join(PRIVATE_FOLDER_PATH, 'cert.pem');

if (fs.existsSync(CERT_PATH)) {
  process.stdout.write(chalk.yellow('📄  Existing certificate found') + chalk.dim(' – Replacing\n'));
  fs.unlinkSync(CERT_PATH);
}
if (fs.existsSync(CERT_KEY_PATH)) {
  process.stdout.write(chalk.yellow('🔑  Existing private key found') + chalk.dim(' – Replacing\n'));
  fs.unlinkSync(CERT_KEY_PATH);
}

process.stdout.write(chalk.yellow('🔐  Generating certificates'));
getDevelopmentCertificate('preact-hn', {installCertutil: true})
  .then(({key, cert}) => {
    process.stdout.write(chalk.dim(' – ') + chalk.green.bold('✅  Success!\n'));

    fs.writeFileSync(CERT_PATH, cert);
    fs.writeFileSync(CERT_KEY_PATH, key);

    fs.chmodSync(CERT_PATH, '0400');
    fs.chmodSync(CERT_KEY_PATH, '0400');
    process.exit(0);
  })
  .catch(err => {
    process.stderr.write(
      chalk.red(
        `Issue generating certificates. Please consult the "Manually Generating Certificates" section of the README\n${err}\n`,
      ),
    );
    process.exit(1);
  });
