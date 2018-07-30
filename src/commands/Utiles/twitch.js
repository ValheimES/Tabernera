const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'perfil',
			runIn: ['text', 'dm', 'group'],
			permissionLevel: 3,
			description: 'Mira el estado de tu cuenta.',
			extendedHelp: '+twitch añadir/quitar <@usuario> <NombreCuentaTwitch>',
			usage: '+twitch <añadir|quitar> <usuario:user> <nombreCuentaTwitch:str> [...]',
			comando: '+twitch'
		});
	}

	async añadir(msg, [usuario, ...nombreCuentaTwitch]) {
		const { errors, updated } = await msg.guild.configs.update('streamers', nombreCuentaTwitch.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'add' });
		if (errors.length) return msg.send('Ha ocurrido un error');
		if (!updated.length) return msg.send('Ha ocurrido un error');
		await msg.guild.members.get(usuario).roles.add(msg.guild.roles.get('407255950232256521'));
		return msg.send('Actualizado');
	}

	async quitar(msg, [usuario, ...nombreCuentaTwitch]) {
		const { errors, updated } = await msg.guild.configs.update('streamers', nombreCuentaTwitch.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'remove' });
		if (errors.length) return msg.send('Ha ocurrido un error');
		if (!updated.length) return msg.send('Ha ocurrido un error');
		await msg.guild.members.get(usuario).roles.remove(msg.guild.roles.get('407255950232256521'));
		return msg.send('Actualizado');
	}

};
