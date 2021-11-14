import puppeteer, { Page } from 'puppeteer'

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

const browser = await puppeteer.launch()
const page = await browser.newPage()

await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0')

await page.goto('https://www.tokopedia.com/p/handphone-tablet/handphone?ob=5&page=1')

await page.setViewport({
	width: 1920,
	height: 1080,
})

await sleep(1000)

await page.keyboard.press('ArrowDown', { delay: 100 })
// await sleep(200)

await page.screenshot({ path: 'tokped.png', fullPage: true })

await browser.close()

export default {}
