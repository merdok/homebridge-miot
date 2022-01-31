#!/usr/bin/env node

const path = require('path');
require('yargs')
  .commandDir(path.join(__dirname, 'commands'))
  .recommendCommands()
  .demandCommand()
  .argv;
