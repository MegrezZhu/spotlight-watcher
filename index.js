#!/usr/bin/env node
'use strict';

const program = require('commander');
const path = require('path');
const shell = require('shelljs');
const assert = require('assert');
const moment = require('moment');
const fs = require('fs-extra');
const config = require('./src/config');
const inq = require('inquirer');
const os = require('os');

const { checkSpotlightFolder } = require('./src/utils');

fs.ensureFileSync(config.settingPath);
const setting = fs.readJsonSync(config.settingPath, { throws: false }) || {};

program
  .usage('[options] [command]')
  .version(require('./package.json').version);

program
  .command('config')
  .description('start configuration')
  .action(async () => {
    // prompting username to find Windows Spotlight
    const info = await inq.prompt([
      {
        name: 'username',
        message: 'user:',
        default: () => setting.username || os.userInfo().username,
        validate: async answer => {
          const homedir = path.resolve(os.homedir(), '..', answer);
          const imagePath = path.resolve(homedir, `AppData/local`, config.imageDir.replace(/%localappdata%\//, ''));
          if (await checkSpotlightFolder({ username: answer, homedir })) return true;
          else return `Path "${imagePath}" not exists! It may due to an incorrect username (${answer}) or unavailable Windows Spotlight App.`;
        }
      }
    ]);
    info.homedir = path.resolve(os.homedir(), '..', info.username);

    // prompting target folder
    while (true) {
      let {targetDir} = await inq.prompt({
        name: 'targetDir',
        message: 'target folder to which wallpapers are copied:',
        default: () => setting.targetDir || process.cwd()
      });
      targetDir = path.resolve(process.cwd(), targetDir);

      if (await fs.pathExists(targetDir)) {
        info.targetDir = targetDir;
        break;
      } else {
        const { confirm } = await inq.prompt({
          name: 'confirm',
          type: 'confirm',
          message: () => `Path "${targetDir}" does not exist, do you want to create the folder?`,
          default: true
        });
        if (confirm) {
          await fs.mkdir(targetDir);
          info.targetDir = targetDir;
          break;
        } else continue;
      }
    }

    // store setting
    await fs.outputJson(config.settingPath, info, {
      spaces: 2
    });
  });

program
  .command('install')
  .description('install Spotlight Watcher as a windows service')
  .action(async () => {
    try {
      await check();
      require('./service/install');
    } catch (err) {
      console.error(err.message);
    }
  });

program
  .command('uninstall')
  .description('uninstall Spotlight Watcher service')
  .action(async () => {
    try {
      await check();
      require('./service/uninstall');
    } catch (err) {
      console.error(err.message);
    }
  });

program
  .command('update')
  .description('force update')
  .action(async () => {
    try {
      await check();
      const imager = require('./src/imager');
      const logger = require('./src/logger');
      const result = await imager();
      logger.info(`done. ${result} files copied.`);
    } catch (err) {
      console.error(err.message);
    }
  });

program
  .command('open')
  .description('open destination directory')
  .action(async () => {
    try {
      await check();
      const targetDir = (await getSetting()).targetDir.replace(/\//g, '\\');
      shell.exec(`explorer ${targetDir}`);
    } catch (err) {
      console.error(err.message);
    }
  });

program
  .command('log')
  .description('list logs for today')
  .action(async () => {
    // for cmd, use 'more' instruction
    shell.exec(`more ${path.resolve(__dirname, 'logs', `${moment().format('YYYY-MM-DD')}.log`)}`);
  });

program
  .command('logs')
  .description('open log directory')
  .action(async () => {
    shell.exec(`explorer ${path.resolve(__dirname, 'logs')}`);
  });

program.parse(process.argv);

async function getSetting () {
  assert(setting.targetDir, 'warn: settings not detected, complete configuration first');
  return setting;
}

async function check () {
  assert(setting.targetDir, 'warn: settings not detected, complete configuration first');
}
