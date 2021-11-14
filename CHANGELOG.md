<a name="unreleased"></a>
## [Unreleased]


<a name="v1.0.1"></a>
## [v1.0.1] - 2021-11-14
### Doc
- added 100 what in written log
- updated readme md to link changelog md

### Fix
- **tokopedia-scraper:** fix if err logic not passed even if page successfully loads and add retry for gettings links in product page


<a name="v1.0.0"></a>
## v1.0.0 - 2021-11-14
### Chore
- removed unused params

### Cleanup
- **images:** remove images

### Doc
- added git chglog template
- added readme.md
- added comments to briefly explains what the functions do to scraper and csv writer

### Feat
- **csv-writer:** added csv writer module
- **npm:** added rimraf to clean output on using npm start script
- **scraper:** finished scraper workjob
- **scraper:** added browser close connection
- **scraper:** bootstrapped tokopedia scraper
- **service:** scrap service now only shows 100 not more
- **tokopedia-scraper:** scraper is now multi threaded

### Gitignore
- added png and pdf to gitignore

### Init
- bootstrapped project

### Log
- added log on finishing writing to csv

### Refactor
- **package.json:** moved typescript and rimraf to normal dependencies so it will still install in production env
- **tokopedia scraper:** navigation is combined to getURLLIst so it's more readable


[Unreleased]: https://github.com/tigorlazuardi/tokopedia-web-scrapper/compare/v1.0.1...HEAD
[v1.0.1]: https://github.com/tigorlazuardi/tokopedia-web-scrapper/compare/v1.0.0...v1.0.1
