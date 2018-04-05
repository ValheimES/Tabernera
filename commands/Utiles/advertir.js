const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			name: 'advertir',
			runIn: ['text'],
			permLevel: 5,
			description: 'Permite a un moderador añadir una advertencia de manera manual a un\n usuario que haya infringido las normativas. Es un sistema acumulativo que al llegar a\n la tercera advertencia, pone el caso a disposición de la administración para evaluarlo y aplicar\n una sanción según la gravedad del asunto, que puede ser desde una expulsión temporal, hasta\n un bloqueo permamente.',
			usage: '<usuario:User> <advertencia:str> [...]',
			usageDelim: ' ',
			extendedHelp: '+advertir @Usuario Incumplimiento de la normativa 1.1.2: Autopromocionarse.',
			comando: '+advertir <Usuario> <Razón>',
			opcional: ['```md',
				`* Hay que tener precaucion con este comando.`,
				'```']
		});
	}

	async run(msg, [usuario, ...adv]) {
		const canal = msg.guild.channels.get(msg.guild.configs.Admins);

		const MySql = await this.client.providers.get('MySQL');

		const exists = await MySql.has2('Strikes', `${usuario.id}`);

		adv = `${adv.join(' ')}`;

		if (!exists) {
			await MySql.insert2('Strikes', ['UserID', 'Desc', 'Desc2', 'Desc3', 'Numero'], [`${usuario.id}`, `${adv}`, `No hay información todavía`, `No hay información todavía`, `1`]);
			msg.delete(1000);
			return msg.send('Se ha creado la advertencia.');
		}

		var numeroAdv;
		const base = await MySql.get('Strikes', 'UserID', usuario.id);
		numeroAdv = base.Numero;
		var usuarioPorID = await this.client.users.fetch(base.UserID);

		if (numeroAdv === 1) {
			if (MySql.update2('Strikes', `${usuario.id}`, 'Numero', `${parseInt(base.Numero) + 1}`) && MySql.update2('Strikes', `${usuario.id}`, 'Desc2', `${adv}`)) {
				msg.delete(1000);
				return msg.send('Se ha creado la advertencia.');
			} else {
				throw 'Se ha producido un error';
			}
		} else if (numeroAdv === 2) {
			if (MySql.update2('Strikes', `${usuario.id}`, 'Numero', `${parseInt(base.Numero) + 1}`) && MySql.update2('Strikes', `${usuario.id}`, 'Desc3', `${adv}`)) {
				msg.send('Se ha creado la advertencia.');
			} else {
				throw 'Se ha producido un error';
			}

			canal.send(`${msg.guild.roles.get(msg.guild.configs.AdminRolId)} ${usuarioPorID} tiene 3 advertencias, hora de examinar el caso.`);
			return msg.delete(1000);
		} else if (numeroAdv > 2) {
			msg.delete(1000);

			return msg.send(`${msg.author} , el usuario ya tiene 3 advertencias, no son necesarias más.`);
		}

		return true;
	}

};
