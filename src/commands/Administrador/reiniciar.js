const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			description: 'Reinicia el bot.',
			extendedHelp: '+reiniciar'
		});
	}

	async run(message) {
		await message.sendMessage(message.language.get('COMMAND_REBOOT')).catch(err => this.client.emit('error', err));
		process.exit();
	}

};
