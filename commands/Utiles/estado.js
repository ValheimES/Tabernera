const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			name: 'estado',
			enabled: true,
			runIn: ['text'],
			cooldown: 4,
			permLevel: 6,
			description: 'Cambia el estado.',
			usage: '<estado:str> [...]',
			extendedHelp: '+estado',
			comando: '+estado'
		});
	}
	async run(msg, [...estado]) {
		const bot = msg.client.users.get('408643206369116160');

		estado = `${estado.join(' ')}`;

		await bot.setActivity(estado);

		await msg.channel.send('Se ha cambiado el estado.');
		await msg.delete(100);

		return true;
	}

};
