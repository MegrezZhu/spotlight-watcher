#!/usr/bin/env node
'use strict';

const program = require('commander');
const shell = require('shelljs');

program
  .usage('[options] [command]')
  .version('1.0.0');

program
  .command('install')
  .description('install Spotlight Watcher as a windows service')
  .action(() => {
    require('./service/install');
  });

program
  .command('uninstall')
  .description('uninstall Spotlight Watcher service')
  .action(() => {
    require('./service/uninstall');
  });

program
  .command('open')
  .description('open destination directory')
  .action(() => {
    shell.exec(`explorer ${require('./src/config').targetDir.replace('/', '\\')}`);
  });

// TODO: add command to change config item like targetDir
// program
//   .command('set [key] [value]')
//   .description('configuration')
//   .action(async (key, value) => {
//     assert(key, 'key needed');
//     assert(value, 'value needed');
//   });

program.parse(process.argv);
