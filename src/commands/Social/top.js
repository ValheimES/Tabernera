const { Command, util: { codeBlock } } = require('../../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 6,
			description: 'Muestra una lista de los 10 mejores piratas de los 7 mares',
			extendedHelp: '+top'
		});
	}

	async run(msg) {
		const lista = this.client.gateways.users.cache.sort((a, b) => b.xp - a.xp).first(10);
		const usuarios = await Promise.all(lista.map(conf => this.client.users.fetch(conf.id)));

		return msg.sendEmbed(new MessageEmbed()
			.setTitle('<:logosot:422342751393153024> TOP 10 PIRATAS')
			.setColor(0x2b9d98)
			.setDescription(`Lista de los piratas más veteranos de los mares:\n${codeBlock('cs', lista
				.map((c, i) => `[${i + 1}] > #${usuarios[i].username}\n        Oro: ${String(0).padStart(7, ' ')}    Exp: ${String(c.xp).padStart(7, ' ')}    Nivel: ${this.resolveLevel(c.xp)}`)
				.join('\n\n'))}`
			)
		);
	}

	resolveLevel(exp) {
		if (exp >= 67525)
			return 'Rey pirata';
		if (exp >= 23850)
			return 'Pirata experto';
		if (exp >= 11825)
			return 'Pirata rufián';
		if (exp >= 4675)
			return 'Grumete gallina';
		if (exp >= 1150)
			return 'Rata de mar';

		return 'Limpiacubiertas';
	}

};
