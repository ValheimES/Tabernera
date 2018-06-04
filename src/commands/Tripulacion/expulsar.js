const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 3,
			description: '¡Para el capitán de su tripulación!',
			usage: '<pirata:member>',
			extendedHelp: '+expulsar <Pirata>',
			comando: '+expulsar <Pirata>'
		});
	}

	async run(msg, [member]) {
		if (msg.author.id === member.user.id) throw '¡No puedes dejar a tus compañeros abandonados! Si quieres abandonar tu tripulación, ¡habla con un administrador!';

		const { tripulacion } = msg.author.configs;
		if (!msg.author.configs.tripulacion) throw 'Usted no está en ninguna tripulación.';

		const crew = this.client.gateways.crews.get(tripulacion);
		if (!crew) throw '¡Usted no debería ni leer esto! ¡Contacte con mis programadores! Usted está unido a una tripulación, ¡pero no está en la lista!';

		if (msg.author.id !== crew.owner) throw `¡Usted no es el capitán de la tripulación ${tripulacion}!`;

		if (member.user.configs._syncStatus) await member.user.configs._syncStatus;
		if (!member.user.configs.tripulacion) throw '¿Cómo vas a expulsar a un alcornoque? ¡Ni siquiera está en una tripulación!';
		if (member.user.configs.tripulacion !== tripulacion) throw '¡Argh! ¡Usted debió de beber demasiado grog! ¿Ya olvidó los nombres de sus tripulantes?';

		if (member.roles.has(crew.role)) await member.roles.remove(crew.role);
		await crew.update('members', member.user);
		await member.user.configs.update('tripulacion', null);

		return msg.sendMessage(`¡Listo! ¡${member} se queda en mi taberna bebiendo grog del bueno hasta que otro lo recoja en su barco!`);
	}

};
