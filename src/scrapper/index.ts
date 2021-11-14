export class ScrapeData {
	constructor(
		public product_name: string,
		public description: string,
		public image_link: string,
		public price: number,
		public rating: number,
		public merchant_name: string,
	) {}

	static csvHeaders(): string[] {
		return ['product_name', 'descripton', 'image_link', 'price', 'rating', 'merchant_name']
	}

	csvRow(): string[] {
		return [
			this.product_name,
			this.description,
			this.image_link,
			this.price.toString(),
			this.rating.toString(),
			this.merchant_name,
		]
	}
}

export class ScrapeDataList {
	private list: { [url: string]: ScrapeData }
	constructor() {
		this.list = {}
	}

	append(url: string, data: ScrapeData) {
		this.list[url] = data
	}

	csvHeaders(): string[] {
		return ScrapeData.csvHeaders()
	}

	csvRows(): string[][] {
		return Object.values(this.list).map((data) => data.csvRow())
	}
}

export interface Scraper {
	scrap: (url: string) => Promise<ScrapeDataList>
}
