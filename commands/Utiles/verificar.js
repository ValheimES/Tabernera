const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			name: 'verificar',
			runIn: ['text'],
			permLevel: 4,
			description: 'Sincroniza los datos de la cuenta de Discord con la cuenta de Xbox.',
			usage: '<usuario:User> <rol:str> <nombre:str> [...]',
			usageDelim: ' ',
			extendedHelp: '+verificar @Rufus @Insider xRufusDeponia20',
			comando: '+verificar <@Usuario> <@Rol> <NombreXbox>'
		});
	}

	async run(msg, [user, rol, ...nombre]) {
		nombre = nombre.join(' ');
		var taberna = msg.guild.channels.get(msg.guild.configs.Admins);

		const MySql = await this.client.providers.get('MySQL');

		const member = msg.mentions.members.first();

		if (rol === 'Pionero') {
			member.roles.add([msg.guild.roles.find('name', 'Pionero'),
				msg.guild.roles.find('name', 'Fundador'),
				msg.guild.roles.find('name', 'Insider'),
				msg.guild.roles.find('name', 'Verificado')]);
		} else if (rol === 'Fundador') {
			member.roles.add([msg.guild.roles.find('name', 'Fundador'),
				msg.guild.roles.find('name', 'Insider'),
				msg.guild.roles.find('name', 'Verificado')]);
		} else if (rol === 'Insider') {
			member.roles.add([msg.guild.roles.find('name', 'Insider'),
				msg.guild.roles.find('name', 'Verificado')]);
		} else if (rol === 'Verificado') {
			member.roles.add(await msg.guild.roles.find('name', 'Verificado'));
		} else {
			return msg.channel.send('Has escrito mal el nombre de el rol');
		}

		member.setNickname(nombre);

		MySql.insert2('Verificacion', ['UserID', 'Rango'], [`${user.id}`, `${rol.name}`]);

		return taberna.send(`<:tic:408639986934480908> **¡Cuenta verificada!:** _${member}, ahora puedes disfrutar de las ventajas de la verificación. Haz click aquí­ para más <#424868390654443520>._`);
	}

};
