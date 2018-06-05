const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 6,
			usage: '<rol:role>',
			description: 'Te permite quitar un rol de la lista de roles autoasignables.',
			extendedHelp: '+quitarrol @Meta 2000 piratas conseguida',
			comando: '+quitarrol <Rol>'
		});
	}

	async run(msg, [rol]) {
		const { autoRoles } = msg.guild.configs.roles;

		if (!autoRoles.include(rol.id))
			return msg.sendMessage('El rol no es autoasignable');

		await msg.guild.configs.update('roles.autoRoles', rol.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'remove' });

		return msg.sendMessage('El rol ya no es autoasignable');
	}

};
