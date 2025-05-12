export const DBConfig = {
	name: 'media-cache',
	version: 1,
	objectStoresMeta: [
		{
			store: 'files',
			storeConfig: {
				keyPath: 'filename',
				autoIncrement: false,
			},
			storeSchema: [
				{
					name: 'filename',
					keypath: 'filename',
					options: { unique: true },
				},
				{
					name: 'file',
					keypath: 'file',
					options: { unique: false },
				},
			],
		},
	],
}
