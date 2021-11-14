import CSVWriter from '../csv_writer/index.js'
import { Scraper } from '../scrapper/index.js'

export default class ScrapperService {
	constructor(private scrapper: Scraper, private writer: CSVWriter, private url: string) {}

	async scrap() {
		const data = await this.scrapper.scrap(this.url)
		await this.writer.writeRecords(data.csvRows())
	}
	close() {
		return this.scrapper.close()
	}
}
