const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'estado',
			enabled: true,
			runIn: ['text'],
			cooldown: 4,
			permissionLevel: 6,
			description: 'Cambia el estado.',
			usage: '<estado:str{2,32}>',
			extendedHelp: '+estado',
			comando: '+estado'
		});
	}
	async run(msg, [estado]) {
		msg.delete(100);
		await this.client.user.setActivity(estado);
		return msg.sendMessage('Se ha cambiado el estado.');
	}

};
