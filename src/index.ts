import CSVWriter from './csv_writer/index.js'
import filename from './pkg/filename.js'
import { TokopediaScrapeData } from './scrapper/index.js'
import TokopediaScraper from './scrapper/tokopedia_scraper.js'
import ScrapperService from './service/scrap_service.js'

const scrapper = await TokopediaScraper.init()
const writer = new CSVWriter(filename(), TokopediaScrapeData.csvHeaders())

const service = new ScrapperService(scrapper, writer, 'https://www.tokopedia.com/p/handphone-tablet/handphone?ob=5')

await service.scrap()

await service.close()
