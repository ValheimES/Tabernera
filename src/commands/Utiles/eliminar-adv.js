const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			name: 'eliminar-adv',
			permissionLevel: 5,
			description: 'Elimina las advertencias de un usuario.',
			usage: '<usuario:User>',
			extendedHelp: '+eliminar-adv @Usuario',
			comando: '+eliminar-adv <Usuario>',
			opcional: ['```md',
				`* Hay que tener precaucion con este comando.`,
				'```']
		});
	}

	async run(msg, [usuario]) {
		const provider = this.client.providers.default;
		msg.delete(1000);

		if (await provider.has('strikes', usuario.id)) {
			await provider.delete('strikes', usuario.id);
			return msg.sendMessage('El usuario ya no tiene advertencias.');
		}

		return msg.sendMessage('El usuario no tiene advertencias.');
	}

};
