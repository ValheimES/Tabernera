const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 6,
			usage: '<name:string>',
			description: 'Crea una nueva tripulación',
			extendedHelp: '+crear <Nombre de Tripulación>',
			comando: '+crear <Nombre de Tripulación>'
		});
	}

	async run(msg, [name]) {
		if (this.client.gateways.crews.cache.has(name)) throw `¡Argh! ¡Me parece haber visto esta tripulación antes en esta taberna! ¡Sé más original!`;
		const crew = this.client.gateways.crews.get(name, true);

		const role = await msg.guild.roles.create({
			data: { name, color: 0xBC8E5F, hoist: true, mentionable: true },
			reason: '¡Creación de una nueva tripulación!'
		});
		await msg.guild.channels.create({
			type: 'text',
			parent: '452008445999316993',
			overwrites: [{ id: msg.guild.id, denied: ['VIEW_CHANNEL'] }, { id: role.id, allowed: ['VIEW_CHANNEL'] }]
		});

		if (crew._syncStatus) await crew._syncStatus;
		await crew.update('role', role);

		return msg.sendMessage('¡Listo! ¡Acuérdate de asignar un capitán que sepa nadar!');
	}

};
