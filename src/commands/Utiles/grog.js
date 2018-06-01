const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			name: 'grog',
			enabled: true,
			runIn: ['text'],
			cooldown: 4,
			description: 'sirve un grog.',
			usage: '<usuario:user>',
			extendedHelp: '+grog',
			comando: '+grog',
			permissionLevel: 4
		});
	}

	async run(msg, [usuario]) {
		var taberna = msg.client.channels.get('375828283704475649');
		var Textos = [`Hola ${usuario} sirvete🍺`, `${usuario} sirvete guapo🍺`, `Aqui tienes ${usuario} 🍺`];
		return taberna.send(Textos[Math.floor(Math.random() * Textos.length)]);
	}

};
