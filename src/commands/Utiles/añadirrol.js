const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 6,
			usage: '<rol:role>',
			description: 'Te permite incluír un rol en la lista de roles autoasignables.',
			extendedHelp: '+añadirrol @Meta 2000 piratas conseguida',
			comando: '+añadirrol <Rol>'
		});
	}

	async run(msg, [rol]) {
		const { autoRoles } = msg.guild.configs.roles;

		for (let i = 0; i < autoRoles.length; i++) {
			if (autoRoles[i] === rol.id)
				return msg.sendMessage('El rol ya fue añadido, revisa el diaro.');
		}
		await msg.guild.configs.update('roles.autoRoles', rol.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'add' });

		return msg.sendMessage('El rol ha sido añadido como autoasignable');
	}

};
