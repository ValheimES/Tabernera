const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			aliases: ['u'],
			permLevel: 10,
			name: 'descargar',
			description: 'Descarga un modulo de Klasa.',
			usage: '<Piece:piece>',
			extendedHelp: '+descargar languages'
		});
		this.comando = '+descargar <Modulo>';
		this.admins = true;
	}

	async run(msg, [piece]) {
		piece.unload();
		if (this.client.shard) {
			await this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) this.${piece.store}.get('${piece.name}').unload();
			`);
		}
		return msg.sendMessage(msg.language.get('COMMAND_UNLOAD', piece.type, piece.name));
	}

};
