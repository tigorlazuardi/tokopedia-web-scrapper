import fs from 'fs'
import { createArrayCsvWriter } from 'csv-writer'
import { CsvWriter } from 'csv-writer/src/lib/csv-writer'
import { ObjectMap } from 'csv-writer/src/lib/lang/object'

/**
 * CSVWriter is a class to prepare writing csv. It also check if filename already exists.
 *
 * Only when the method writeRecords is called that a file is created.
 */
export default class CSVWriter {
	private writer: CsvWriter<ObjectMap<any>>

	constructor(public filename: string, headers: string[]) {
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
		console.log(`written ${records.length} to ${this.filename}`)
	}
}
