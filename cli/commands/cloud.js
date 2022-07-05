const path = require('path');

exports.command = 'cloud <command>';
exports.description = 'Connect to the MiCloud';
exports.builder = yargs => yargs.commandDir(path.join(__dirname, 'cloud'));
exports.handler = () => {};
