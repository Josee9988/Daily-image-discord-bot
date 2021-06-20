# **Change Log** 📜📝

All notable changes to the "**Daily Image Bot**" discord bot will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [**1.3.0**] - 2021-06-20

### Removed

* Node short url. The url will not be send as a message.

## [**1.2.1**] - 2021-05-22

### Added

* Check of the channel id can be gathered before sending the random image.

## [**1.2.0**] - 2021-05-20

### Fixed

* Some bugs to allow all the users to receive the photo by the cron.

## [**1.1.12**] - 2021-04-10

### Added

* Dev.to link in the help commands.

### Changed

* Order of some links in the help commands.

## [**1.1.11**] - 2021-03-21

### Added

* New donate link in the information commands.

## [**1.1.10**] - 2021-03-21

### Added

* Badges in the README.md file.

## [**1.1.9**] - 2021-03-12

### Changed

* The given url will now be shortened.

## [**1.1.8**] - 2021-03-12

### Changed

* When sending the image, it will additionally send the link instead of the actual file

## [**1.1.7**] - 2021-03-07

### Added

* Number of servers using the bot in the info command.

## [**1.1.6**] - 2021-02-19

### Added

* Database status in the *ping* command.

## [**1.1.5**] - 2021-02-08

### Improved

* Heroku deploy and app performance by reducing node_modules size

## [**1.1.4**] - 2021-02-07

### Added

* !dimg now can only be executed by an administrator.
* When the bot joins a new server it sends a DM to the server owner.

## [**1.1.3**] - 2021-02-07

### Added

* Now command, to force a photo to appear now.

## [**1.1.2**] - 2021-02-06

### Added

* TypeScript tslib to reduce bundle size.
* TypeScript variable annotations.

### Improved

* Code style and structure (a bit of refactoring).

### Changed

* Build command will now remove the out/ folder first, and then build it back.

### Removed

* .map files in the out/ folder.

## [**1.1.1**] - 2021-02-05

### Added

* Basic code documentation.

### Changed

* Some code structures. The code was refactored and slighty improved.

## [**1.1.0**] - 2021-02-05

### Added

* The set channel and set albumlink commands now can only be performed by server admins, to increase security and avoid.

## [**1.0.1**] - 2021-02-05

### Improved

* Application response time. By caching less dependencies into heroku, and building the out/ folder with an extra web
  call (Procfile).

### Added

* CHANGELOG.md file.

### Fixed

* Some typos in the README.md file.

## [**1.0.0**] - 2021-02-04

### Added

* Bot seems to work fine. It saves the data to mongodb and sends an image every 12hours.
