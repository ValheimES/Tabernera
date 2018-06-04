const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 3,
			description: '¡Para el capitán de su tripulación!',
			usage: '<pirata:member>',
			extendedHelp: '+reclutar <Pirata>',
			comando: '+reclutar <Pirata>'
		});
	}

	async run(msg, [member]) {
		if (msg.author.id === member.user.id) throw '¿Te faltan compañeros? ¡No puedes reclutarte a tí mismo!';

		const { tripulacion } = msg.author.configs;
		if (!msg.author.configs.tripulacion) throw 'Usted no está en ninguna tripulación.';

		const crew = this.client.gateways.crews.get(tripulacion);
		if (!crew) throw '¡Usted no debería ni leer esto! ¡Contacte con mis programadores! Usted está unido a una tripulación, ¡pero no está en la lista!';

		if (msg.author.id !== crew.owner) throw `¡Usted no es el capitán de la tripulación ${tripulacion}!`;

		if (member.user.configs._syncStatus) await member.user.configs._syncStatus;
		if (member.user.configs.tripulacion) throw member.user.configs.tripulacion === tripulacion ? '¿Ya lo olvidaste? ¡Él ya forma parte de tu tripulación!' : '¡El pirata está en una tripulación!';

		const message = await msg.sendMessage(`¡Argh! ¡El capitán ${msg.author} quiere que te unas a la tripulación ${tripulacion}! ¿Te unes, ${member}?`);
		await message.react('tic:408639986934480908');
		await message.react('cruz:407160220624617484');
		const reacts = await message.awaitReactions((_, rUser) => member.user.id === rUser.id);

		if (reacts.has('408639986934480908')) {
			await member.roles.add(crew.role);
			await member.user.configs.update('tripulacion', tripulacion);
			await this.client.gateways.crews.get(tripulacion).update('members', member.user);
			return msg.sendMessage(`¡Bienvenido a bordo! Ahora formas parte de la tripulación ${tripulacion}, ¡espero que hagamos muchas aventuras juntos, ${member}!`);
		}

		if (reacts.has('407160220624617484'))
			return msg.sendMessage(`¡Argh! ¡El pirata ${member} rechazó su oferta, capitán ${msg.author}!`);

		return msg.sendMessage(`¿No tuviste suficiente grog? ¡Esa no es una respuesta válida, pirata!`);
	}

};
