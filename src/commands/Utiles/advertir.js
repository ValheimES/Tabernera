const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 5,
			description: 'Permite a un moderador añadir una advertencia de manera manual a un\n usuario que haya infringido las normativas. Es un sistema acumulativo que al llegar a\n la tercera advertencia, pone el caso a disposición de la administración para evaluarlo y aplicar\n una sanción según la gravedad del asunto, que puede ser desde una expulsión temporal, hasta\n un bloqueo permamente.',
			usage: '<usuario:User> <advertencia:str> [...]',
			usageDelim: ' ',
			extendedHelp: '+advertir @Usuario Incumplimiento de la normativa 1.1.2: Autopromocionarse.',
			comando: '+advertir <Usuario> <Razón>',
			opcional: ['```md', `* Hay que tener precaucion con este comando.`, '```']
		});
	}

	async run(msg, [usuario, ...adv]) {
		const provider = this.client.providers.default;

		if (!await provider.has('strikes', usuario.id)) {
			await provider.create('strikes', usuario.id, { numero: 1, desc1: adv.join(' ') });
			msg.delete();
			return msg.sendMessage('Se ha creado la primera advertencia.');
		}

		const { numero } = await provider.get('strikes', usuario.id);
		if (numero >= 3) return msg.sendMessage(`${msg.author}, el usuario ya tiene 3 advertencias, no son necesarias más.`);

		await provider.update('strikes', usuario.id, { numero: numero + 1, [numero === 1 ? 'desc2' : 'desc3']: adv.join(' ') });
		if (numero === 2) {
			const taberna = msg.guild.channels.get(msg.guild.configs.channels.administrador);
			if (taberna) await taberna.send(`<@&${msg.guild.configs.roles.administrador}> ${usuario.username} tiene 3 advertencias, hora de examinar el caso.`);
		}
		return msg.sendMessage('Se ha creado la advertencia.');
	}

};
