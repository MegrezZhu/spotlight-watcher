const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');
const moment = require('moment');

const config = require('./config');

module.exports = new winston.Logger({
  transports: [
    new winston.transports.DailyRotateFile({
      name: 'error-log',
      filename: path.resolve(__dirname, config.logDir, './error/log'),
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      level: 'error',
      timestamp: timeStamp
    }),
    new winston.transports.DailyRotateFile({
      name: 'info-log',
      filename: path.resolve(__dirname, config.logDir, './log'),
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      level: 'info',
      timestamp: timeStamp
    }),
    new winston.transports.Console()
  ]
});

function timeStamp () {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}
