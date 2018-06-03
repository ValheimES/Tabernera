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
		const insider = msg.guild.roles.get(msg.guild.configs.roles.insider);
		if (!insider) throw 'El rol de Insiders no está configurado o no existe.';

		const verificado = msg.guild.roles.get(msg.guild.configs.roles.verificado);
		if (!verificado) throw 'El rol de Verificado no está configurado o no existe.';

		let number = 0;
		for (const member of msg.guild.members.values()) {
			if (member.roles.has(insider.id) && !member.roles.has(verificado.id)) {
				await member.roles.add(verificado);
				number++;
			}
		}

		return msg.sendMessage(`Operación completada, se ha añadido el rol ${verificado.name} a ${number} usuario${number !== 1 ? 's' : ''}.`);
	}

};
