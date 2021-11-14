import { TokopediaScrapeDataList, Scraper, TokopediaScrapeData, ITokopediaScrapeData } from './index.js'
import puppeteer, { Browser, Page } from 'puppeteer'
import sleep from '../pkg/sleep.js'

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
		const browser = await puppeteer.launch()
		return new TokopediaScraper(browser)
	}

	async scrap(url: string): Promise<TokopediaScrapeDataList> {
		const page = await this.browser.newPage()
		await this.setupPage(page)
		let i = 0
		while (this.list.len() < 100) {
			i++
			const target = url + `&page=${i}`
			await this.navigateProductList(page, target)
			const urls = await this.getURLList(page)
			for (const urlProduct of urls) {
				const data = await this.navigateProductPage(page, urlProduct)
				console.log(data)
				this.list.append(urlProduct, data)
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

	private async navigateProductList(page: Page, url: string) {
		await page.goto(url)
		// Trigger lazy load products
		await page.keyboard.press('ArrowDown', { delay: 100 })
	}

	private async navigateProductPage(page: Page, url: string): Promise<TokopediaScrapeData> {
		await page.goto(url)
		await sleep(200)
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

		return TokopediaScrapeData.fromInterface(result)
	}

	private async getURLList(page: Page) {
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
		return this.browser.close()
	}
}
