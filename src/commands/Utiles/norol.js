const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 6,
			usage: '<rol:role>',
			description: 'Te permite salir del grupo de roles de la lista de roles autoasignables en el que ya estabas.',
			extendedHelp: '+norol @Meta 2000 piratas conseguida',
			comando: '+norol <Rol>'
		});
	}

	async run(msg, [rol]) {
		const { autoRoles } = msg.guild.configs.roles;
		const member = await msg.guild.members.fetch(msg.author.id);

		if (!autoRoles.include(rol.id))
			return msg.sendMessage('El rol no es autoasignable');

		await member.roles.remove(rol, 'A causa de el comando norol');
		return msg.sendMessage(`El rol ${rol.name} ya no es tuyo`);
	}

};
