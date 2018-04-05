const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			name: 'actualizar',
			runIn: ['text'],
			permLevel: 6,
			description: 'Comando de un uso',
			usage: '',
			usageDelim: ' ',
			extendedHelp: '+actualizar',
			comando: '+actualizar',
			opcional: ['```md',
				`* Hay que tener precaucion con este comando.`,
				'```']
		});
	}

	async run(msg) {
		var members = msg.guild.members.array();

		for (let i = 0; i < members.length; i++) {
			if (await members[i].roles.exists('name', 'Insider') && !members[i].roles.exists('name', 'Verificado')) {
				await members[i].addRole(msg.guild.roles.find('name', 'Verificado'));
			}
		}

		return msg.send('Completado');
	}

};
