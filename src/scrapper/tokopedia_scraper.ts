import { ScrapeDataList, Scraper } from './index.js'
import puppeteer, { Browser, Page } from 'puppeteer'
import sleep from '../pkg/sleep.js'

/**
 * For normal use, do not construct using `new` directly.
 * but call the static method `init` to instance this class instead.
 */
export default class TokopediaScraper implements Scraper {
	private list: ScrapeDataList
	constructor(private browser: Browser) {
		this.list = new ScrapeDataList()
	}

	static async init(): Promise<TokopediaScraper> {
		const browser = await puppeteer.launch()
		return new TokopediaScraper(browser)
	}

	async scrap(url: string): Promise<ScrapeDataList> {
		const page = await this.browser.newPage()
		await this.setupPage(page)
		await this.navigateProductList(page, url)
		return this.list
	}

	private async setupPage(page: Page) {
		// Fake this crawler as normal user
		await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0')
		await page.setViewport({
			width: 1920,
			height: 1080,
		})
	}

	private async navigateProductList(page: Page, url: string) {
		await page.goto(url)
		await sleep(1000)
		// Trigger lazy load products
		await page.keyboard.press('ArrowDown', { delay: 100 })
	}
}
