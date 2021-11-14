export interface ITokopediaScrapeData {
	product_name: string
	description: string
	image_link: string
	price: string
	rating: string
	merchant_name: string
	product_url: string
}

export class TokopediaScrapeData implements ITokopediaScrapeData {
	constructor(
		public product_name: string,
		public description: string,
		public image_link: string,
		public price: string,
		public rating: string,
		public merchant_name: string,
		public product_url: string,
	) {}

	static fromInterface(s: ITokopediaScrapeData): TokopediaScrapeData {
		return new TokopediaScrapeData(
			s.product_name,
			s.description,
			s.image_link,
			s.price,
			s.rating,
			s.merchant_name,
			s.product_url,
		)
	}

	static csvHeaders(): string[] {
		return ['product_name', 'descripton', 'image_link', 'price', 'rating', 'merchant_name']
	}

	csvRow(): string[] {
		return [this.product_name, this.description, this.image_link, this.price, this.rating, this.merchant_name]
	}
}

export class TokopediaScrapeDataList {
	private list: { [url: string]: TokopediaScrapeData }
	constructor() {
		this.list = {}
	}

	append(url: string, data: TokopediaScrapeData) {
		this.list[url] = data
	}

	csvHeaders(): string[] {
		return TokopediaScrapeData.csvHeaders()
	}

	csvRows(): string[][] {
		return Object.values(this.list).map((data) => data.csvRow())
	}

	len(): number {
		return Object.keys(this.list).length
	}
}

export interface Scraper {
	scrap: (url: string) => Promise<TokopediaScrapeDataList>
	close: () => Promise<void>
}
