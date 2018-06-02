const { Event, util: { makeObject } } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { once: true });
	}

	async run() {
		await this.applySchema(this.client.gateways.guilds, [
			['channels.activados', { type: 'textchannel', array: true }],
			['channels.administrador', { type: 'textchannel' }],
			['channels.busco', { type: 'textchannel' }],
			['channels.comunicados', { type: 'textchannel' }],
			['channels.puerto', { type: 'textchannel' }],
			['channels.reportes', { type: 'textchannel' }],
			['channels.reportes', { type: 'textchannel' }],
			['channels.sugerencias', { type: 'textchannel' }],
			['roles.administrador', { type: 'role' }],
			['roles.inicial', { type: 'role', array: true }],
			['roles.insider', { type: 'role' }],
			['roles.moderador', { type: 'textchannel' }],
			['roles.verificado', { type: 'role' }],
			['roles.verificador', { type: 'textchannel' }]
		]);

		await this.applySchema(this.client.gateways.users, [
			['xp', { type: 'integer' }]
		]);
	}

	async applySchema(gateway, schemas) {
		const { schema } = gateway;
		for (const [key, type] of schemas) {
			if (key.includes('.')) {
				let folder = schema;
				const keys = key.split('.');
				for (let i = 0; i < keys.length; i++) {
					const nextKey = keys[i];
					if (!folder.has(nextKey)) {
						await folder.add(nextKey, makeObject(keys.slice(i + 1, keys.length), type));
						break;
					} else if (folder[nextKey].type !== 'Folder') {
						break;
					}
					folder = folder[nextKey];
				}
			} else if (!schema.has(key)) {
				await schema.add(key, type);
			}
		}
	}

};
