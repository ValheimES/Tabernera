const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['capitán'],
			runIn: ['text'],
			permissionLevel: 6,
			usage: '<Pirata:member> <Tripulación:string>',
			usageDelim: '|',
			description: '¡Asigna un capitán!',
			extendedHelp: '+crear <Pirata> | <Nombre de Tripulación>',
			comando: '+crear <Pirata> | <Nombre de Tripulación>'
		});
	}

	async run(msg, [member, name]) {
		const crew = this.client.gateways.crews.cache.get(name);
		if (!crew) throw `¡Argh! ¿Qué tripulación es esa? ¡No han pasado por aquí nunca!`;

		if (member.user.configs._syncStatus) await member.user.configs._syncStatus;
		if (member.user.configs.tripulacion && member.user.configs.tripulacion !== name) throw `¡El pirata ${member} debería dejar su tripulación antes de irse a otro!`;

		await member.roles.add(crew.role);
		await crew.update('owner', member.user);

		return msg.sendMessage(`¡Listo! ¡Parece que ${member} sabe nadar y sabe cuál es el grog del bueno! Desde hoy, ¡${member} es el capitán de ${name}! ¡Mucha suerte surcando los mares!`);
	}

};
