const chalk = require('chalk');

module.exports.info = (...args) => {
  console.log(chalk.bgWhite.black(' INFO '), args.join(' '));
};

module.exports.error = (...args) => {
  console.log(chalk.bgRed.black(' ERROR '), args.join(' '));
};

module.exports.warn = (...args) => {
  console.log(chalk.bgYellow.black(' WARNING '), args.join(' '));
};

module.exports.success = (...args) => {
  console.log(chalk.bgGreen.black(' SUCCESS '), args.join(' '));
};

module.exports.plain = (...args) => {
  console.log(args.join(' '));
};

module.exports.table = (...args) => {
  console.table(...args);
}
