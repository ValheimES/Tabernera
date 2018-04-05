const Comando = require('../../estructuras/Comando');
const Discord = require('discord.js');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			name: 'ver',
			permLevel: 3,
			description: 'Mira tus advertencias o las de otros.',
			usage: '<advertencias> <usuario:user>',
			usageDelim: ' ',
			extendedHelp: '+ver advertencias @Usuario',
			comando: '+ver advertencias <Usuario>',
			opcional: ['```md',
				`* Hay que tener precaucion con este comando.`,
				'```']
		});
	}

	async advertencias(msg, [usuario]) {
		const MySql = await this.client.providers.get('MySQL');

		const exists = await MySql.has2('Strikes', `${usuario.id}`);

		if (exists) {
			const base = await MySql.get('Strikes', 'UserID', usuario.id);

			var usuarioPorID = await this.client.users.fetch(base.UserID);

			var advertencia = base.Numero > 1 ? 'advertencias' : 'advertencia';

			const embedAdvertencia = new Discord.MessageEmbed()
				.setColor(0xdfbb17)
				.setAuthor(usuarioPorID.username, usuarioPorID.avatarURL())
				.setTitle(`Advertencias`)
				.setURL('http://gamedev.es')
				.setDescription(`Aqui puedes consultar las advertencias de un usuario`)
				.addField('⚠**Advertencia 1:**', `${base.Desc}`)
				.addField('⚠**Advertencia 2:**', `${base.Desc2}`)
				.addField('⚠**Advertencia 3:**', `${base.Desc3}`)
				.setFooter(`El usuario tiene ${base.Numero} ${advertencia}`);

			msg.delete(1000);
			return msg.send(embedAdvertencia);
		} else {
			msg.delete(1000);
			return msg.send('El usuario no tiene advertencias.');
		}
	}

};
