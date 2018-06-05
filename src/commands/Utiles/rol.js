const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 6,
			usage: '<rol:role>',
			description: 'Te permite entrar en el grupo de roles de la lista de roles autoasignables.',
			extendedHelp: '+rol @Meta 2000 piratas conseguida',
			comando: '+rol <Rol>'
		});
	}

	async run(msg, [rol]) {
		const { autoRoles } = msg.guild.configs.roles;
		const member = await msg.guild.members.fetch(msg.author.id);

		if (!autoRoles.include(rol.id))
			return msg.sendMessage('El rol no es autoasignable');

		await member.roles.add(rol, 'A causa de el comando rol');
		return msg.sendMessage(`El rol ${rol.name} ha sido añadido como autoasignable`);
	}

};
