import CSVWriter from '../csv_writer/index.js'
import { Scraper } from '../scrapper/index.js'

export default class ScrapperService {
	constructor(private scrapper: Scraper, private writer: CSVWriter, private url: string) {}

	async scrap() {
		const data = await this.scrapper.scrap(this.url)
		const rows = data.csvRows().slice(0, 100)
		await this.writer.writeRecords(rows)
	}
	close() {
		return this.scrapper.close()
	}
}
