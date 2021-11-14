import fs from 'fs'
import { createArrayCsvWriter } from 'csv-writer'
import { CsvWriter } from 'csv-writer/src/lib/csv-writer'
import { ObjectMap } from 'csv-writer/src/lib/lang/object'

export default class CSVWriter {
	private writer: CsvWriter<ObjectMap<any>>

	constructor(filename: string, headers: string[]) {
		if (fs.existsSync(filename)) {
			throw new Error(`file already exist: ${filename}`)
		}
		this.writer = createArrayCsvWriter({
			path: filename,
			header: headers,
		})
	}

	async writeRecords(records: string[][]) {
		await this.writer.writeRecords(records)
	}
}
