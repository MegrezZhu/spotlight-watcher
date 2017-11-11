# Spotlight Watcher
A tool written in Node.js to periodically copy wallpapers from Windows Spotlight service.
It can be registered as a windows service to auto-run.

## Requirement
* [node.js](https://nodejs.org/en/) >= 8.0.0
* Windows 10 1607 (since which Windows Spotlight has been included) or greater

## Use
1. install using NPM `npm i -g spotlight-watcher`
2. complete configuration `spotlight config`
3. manually update gallery `spotlight update`
4. (optional) install as a service so that it will regularly update the gallery. `spotlight install` (`spotlight uninstall` to uninstall)
5. enjoy!

## More
See `spotlight -h` in powershell.
