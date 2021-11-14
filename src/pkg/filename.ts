export default function filename(): string {
	const base = new Date()

	const meta: string[] = [
		base.getFullYear().toString(),
		base.getMonth().toString(),
		base.getDay().toString(),
		base.getHours().toString(),
		base.getMinutes().toString(),
		base.getSeconds().toString(),
	]
	return meta.join('_') + '.csv'
}
