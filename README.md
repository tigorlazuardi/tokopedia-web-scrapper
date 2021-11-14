# Tokopedia Web Scrapper

This is a tool to scrap top 100 mobile products in category Mobile Phone / Tablet -> Handphone --> Sort by `Ulasan` in Tokopedia.com.

It uses Chromium Engine and Puppeteer api under the hood to crawl the web.

# Changelog

Go to [CHANGELOG.md](./CHANGELOG.md) for more readable git commits.

# Why Uses Chromium Engine?

One of the reason is because it is actually using a Browser (Finger Printing) and easy to impersonate to be an actual user using actual browser.

Also, Tokopedia has lazy loads in place where simple HTTP get requests will fail to deliver the whole intended product, and so rather than emulating the js requests for asking more product, let's just be a browser instead.

# Why Uses NodeJS (with Typescript)

NodeJS has the best interopability with Chromium via Puppeteer.

Golang's [chromedp](https://github.com/chromedp/chromedp) is not as straight forward as Puppeteer apis.

Most work in NodeJS code space is not CPU bound, but IO Bound so it won't matter much if using "Single-Threaded" language as long as it has Async feature.

# Strengths

## MULTI-THREADED

Yes, it will use threads. At least the chromium browser does. How fast the scraping does depends on your CPU.

It will limit the open tabs on Chromium Browser to your number of CPU, because we don't want the IO network and RAM to explode.

The code lines are in [here](https://github.com/tigorlazuardi/tokopedia-web-scrapper/blob/cf1fec7db96cf1f31cff7b29006d8281212e107f/src/scrapper/tokopedia_scraper.ts#L52-L77).

## Retries

For reliability reasons, there are retry logic placed to ensure data is scrapped wonderfully. At maximum of 3 times before moving on.

# Weakness

## The Top 100 may not be actually Top 100.

This is because of the design choice. When a product page failed to load, the crawler will look to next product page to meet the quota of one hundred.

## No Sorting

Not in the requirements :grin:

## There is a wait time between `Session`

To keep the code readable and easily explainable, once multiple tabs to scrap data are opened, it will wait for all tabs to close first for the current pass, before opening multiple tabs again for next pas.

If there's any retry logic that fires behind it, the code also waits for it too. This limitation of having no ability to open threads in easy way. Yes worker threads does exist, but the cost is heavy (Copying the NodeJS stack is not cheap), and best used for long lived sessions in the background.

This slows down the application speed considerably, but IT IS Easy to reason with as a developer and the code is readable as a team and still a very huge boost in speed than visiting pages one by one. And considering it's only designed for simple use, it's enough.

# Why not use Clean Architecture?

I like module based architecture :grin:, because it packages a domain nicely, especially for simpler applications, I used a `service` module to implement business logic. And if using interfaces to communicate between modules it can pass as Clean Architecture if you squint a bit.

# Requirements

Requires NodeJS 14.10.0 or higher because this application uses ES Modules of Nodejs instead of CommonJS modules. Recommended to just use latest version.

# Installation

Clone this repo.

Then run:

```
npm install
npm start
```

#### NOTE: The installation is going to take a while, because it will download a supported Chromium Browser to `node_modules` folder.
