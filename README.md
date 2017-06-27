# Spotlight Watcher
A tool written in Node.js to periodically copy wallpapers from Windows Spotlight service.
It can be registered as a windows service to auto-run.

## Requirement
* [node.js](https://nodejs.org/en/) >= 8.0.0
* Windows 10 1607 (since which Windows Spotlight has been included) or greater

## Install
1. clone this repository `git clone https://github.com/MegrezZhu/spotlight-watcher.git` and `cd ./spotlight-watcher`
2. install dependencies `npm i --production`
3. link as a global tool `npm link` or `npm i -g .`
4. set username & targetDir `spotlight setUser <username>` and `spotlight setTarget <absolute dir to store wallpapers>`
5. install as a service. `spotlight install` (`spotlight uninstall` to uninstall)
6. enjoy!

## Use
See `spotlight -h` in powershell.