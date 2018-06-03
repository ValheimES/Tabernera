const { Command, util: { toTitleCase } } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'verificar',
			runIn: ['text'],
			permissionLevel: 4,
			description: 'Sincroniza los datos de la cuenta de Discord con la cuenta de Xbox.',
			usage: '<usuario:user> <rol:str> <nombre:str> [...]',
			usageDelim: ' ',
			extendedHelp: '+verificar @Rufus @Insider xRufusDeponia20',
			comando: '+verificar <@Usuario> <@Rol> <NombreXbox>'
		});
	}

	async run(msg, [user, rol, ...nombre]) {
		const taberna = msg.guild.channels.get(msg.guild.configs.channels.administrador);
		if (!taberna) throw 'El canal de Administradores no ha sido configurado o no existe en el servidor.';

		const member = await msg.guild.members.fetch(user.id)
			.catch(() => { throw 'El usuario no parece estar en el servidor, ¿viste fantasmas?'; });

		const roles = [];
		rol = rol.toLowerCase();
		switch (rol) {
			case 'pionero':
				roles.push(this.getRole(msg, 'pionero'));
				// falls through
			case 'fundador':
				roles.push(this.getRole(msg, 'fundador'));
				// falls through
			case 'insider':
				roles.push(this.getRole(msg, 'insider'));
				// falls through
			case 'verificado':
				roles.push(this.getRole(msg, 'verificado'));
				break;
			default:
				throw 'Has escrito mal el nombre del rol.';
		}

		msg.delete();

		if (roles.length) await member.roles.add(roles);
		await member.setNickname(nombre.join(' '));
		await this.client.providers.default.create('verificacion', user.id, { rango: rol });

		return taberna.send(`<:tic:408639986934480908> **¡Cuenta verificada!:** _${member}, ahora puedes disfrutar de las ventajas de la verificación. Haz click aquí­ para más <#424868390654443520>._`);
	}

	getRole(msg, rolename) {
		const role = msg.guild.roles.get(msg.guild.configs.roles[rolename]);
		if (!role) throw `El rol ${toTitleCase(rolename)} no ha sido configurado o no existe en el servidor.`;
		return role;
	}

};
