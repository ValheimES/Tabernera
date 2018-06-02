const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 4,
			description: 'Sirve un grog.',
			usage: '<usuario:user>',
			extendedHelp: '+grog',
			comando: '+grog',
			permissionLevel: 4
		});
	}

	run(msg, [usuario]) {
		const taberna = msg.client.channels.get('375828283704475649');
		const textos = [`Hola ${usuario} sirvete🍺`, `${usuario} sirvete guapo🍺`, `Aqui tienes ${usuario} 🍺`];
		return taberna.send(textos[Math.floor(Math.random() * textos.length)]);
	}

};
