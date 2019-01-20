const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 6,
			description: 'Comando de un uso',
			extendedHelp: '+actualizar',
			opcional: ['```md', `* Hay que tener precaucion con este comando.`, '```']
		});
	}

	async run(msg) {
		const usuario = msg.guild.roles.get(msg.guild.configs.roles.inicial[0]);
		if (!usuario) throw 'El rol de Usuario no está configurado o no existe.';

		let number = 0;
		for (const member of msg.guild.members.values()) {
			if (!member.roles.has(usuario.id)) {
				await member.roles.add(usuario);
				number++;
			}
		}

		return msg.sendMessage(`Operación completada, se ha añadido el rol ${usuario.name} a ${number} usuario${number !== 1 ? 's' : ''}.`);
	}

};
