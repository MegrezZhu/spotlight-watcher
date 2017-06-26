module.exports = {
  interval: 30 * 60 * 1000, // run per 30 min
  service: {
    name: 'Windows Spotlight Watcher',
    description: 'routinely copy wallpaper to windows spotlight',
    script: require('path').resolve(__dirname, './run.js')
  }
};
