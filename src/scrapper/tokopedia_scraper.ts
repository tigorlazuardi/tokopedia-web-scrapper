import { TokopediaScrapeDataList, Scraper, TokopediaScrapeData, ITokopediaScrapeData } from './index.js'
import puppeteer, { Browser, Page } from 'puppeteer'
import sleep from '../pkg/sleep.js'

import os from 'os'

const CPU_THREADS = os.cpus().length

/**
 * For normal use, do not construct using `new` directly.
 * but call the static method `init` to instance this class instead.
 */
export default class TokopediaScraper implements Scraper {
	list: TokopediaScrapeDataList
	constructor(private browser: Browser) {
		this.list = new TokopediaScrapeDataList()
	}

	static async init(): Promise<TokopediaScraper> {
		const browser = await puppeteer.launch({
			timeout: 10000,
		})
		const scraper = new TokopediaScraper(browser)
		// Chromium must be closed on exit
		process.on('exit', scraper.close)

		return scraper
	}

	async scrap(url: string): Promise<TokopediaScrapeDataList> {
		let i = 0
		while (this.list.len() < 100) {
			i++
			const productListPager = await this.browser.newPage()
			await this.setupPage(productListPager)
			const target = url + `&page=${i}`
			const urls = await this.getURLList(productListPager, target)
			await productListPager.close()
			for (let i = 0; i < urls.length + CPU_THREADS; i += CPU_THREADS) {
				const promises = []
				for (let j = 0; j < CPU_THREADS; j++) {
					const idx = i * CPU_THREADS + j
					if (urls[idx]) {
						console.log('visiting', urls[idx])
						const productPager = await this.browser.newPage()
						await this.setupPage(productPager)
						promises.push(this.navigateProductPage(productPager, urls[idx]))
					}
				}
				;(await Promise.allSettled(promises)).forEach(async (result) => {
					if (result.status === 'fulfilled') {
						const [url, data] = result.value
						console.log(data)
						this.list.append(url, data)
					} else {
						console.error(`failed to get scrap result from product page: ${result.reason}`)
					}
				})
				for (const pages of await this.browser.pages()) {
					await pages.close()
				}
			}
		}
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

	private async navigateProductPage(page: Page, url: string): Promise<[string, TokopediaScrapeData]> {
		let err: unknown
		for (let i = 0; i < 3; i++) {
			try {
				await page.goto(url)
				break
			} catch (e) {
				err = e
			}
		}
		if (err) throw err

		// BUG: May need to increase sleep time to wait merchant name and rating because they are not exist when they should
		// But for performance, browser seems to need to open new tabs.
		// TODO: check if page can be closed.
		await sleep(200)

		// Enforce merchant name loading because it's rather down there in the page
		await page.keyboard.press('ArrowDown', { delay: 100 })
		await page.keyboard.press('ArrowDown', { delay: 100 })
		const result = await page.evaluate(async () => {
			const NOT_EXIST = '<not exist>'
			const product_name =
				document.querySelector('h1[data-testid="lblPDPDetailProductName"]')?.textContent ||
				`product_name ${NOT_EXIST}`
			const rating =
				document.querySelector('span[data-testid="lblPDPDetailProductRatingNumber"]')?.textContent ||
				`rating ${NOT_EXIST}`
			const image_link =
				document.querySelector('div[data-testid="PDPImageMain"] img')?.getAttribute('src') ||
				`image_link ${NOT_EXIST}`
			const price =
				document.querySelector('div[data-testid="lblPDPDetailProductPrice"]')?.textContent ||
				`price ${NOT_EXIST}`

			const description =
				document.querySelector('div[data-testid="lblPDPDescriptionProduk"]')?.textContent ||
				`description ${NOT_EXIST}`
			const merchant_name =
				document.querySelector('a[data-testid="llbPDPFooterShopName"]')?.textContent ||
				`merchant_name ${NOT_EXIST}`

			return {
				product_name,
				image_link,
				price,
				rating,
				description,
				merchant_name,
			} as ITokopediaScrapeData
		})
		result.product_url = url

		return [url, TokopediaScrapeData.fromInterface(result)]
	}

	private async getURLList(page: Page, url: string) {
		let err: unknown
		for (let i = 0; i < 3; i++) {
			try {
				await page.goto(url)
				break
			} catch (e) {
				err = e
			}
		}
		if (err) throw err
		// Trigger lazy load products
		await page.keyboard.press('ArrowDown', { delay: 100 })
		return page.evaluate(async () => {
			const result: string[] = []
			document.querySelectorAll('div[data-testid="lstCL2ProductList"]>div>a').forEach((el) => {
				const link = el.getAttribute('href')
				if (link && !link.includes('https://ta.tokopedia.com/promo')) {
					result.push(link)
				}
			})
			return result
		})
	}

	/**
	 * close connection to tokopedia
	 */
	async close() {
		if (this.browser) {
			return this.browser.close()
		}
	}
}
