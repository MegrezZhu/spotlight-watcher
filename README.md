# Spotlight Watcher
A tool written in Node.js to periodically copy wallpapers from Windows Spotlight service.
It can be registered as a windows service to auto-run.

## Requirement
* [node.js](https://nodejs.org/en/) >= 8.0.0
* Windows 10 1607 (since which Windows Spotlight has been included) or greater

## Use
1. install using NPM `npm i -g spotlight-watcher`
    * or just clone this repository `git clone https://github.com/MegrezZhu/spotlight-watcher.git` and `cd ./spotlight-watcher`
2. install dependencies `npm i --production`
3. link as a global tool `npm link` or `npm i -g .`
4. complete configuration `spotlight config`
5. manually update gallery `spotlight update`
6. (optional) install as a service so that it will regularly update the gallery. `spotlight install` (`spotlight uninstall` to uninstall)
7. enjoy!

## More
See `spotlight -h` in powershell.
