const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['u'],
			permissionLevel: 9,
			description: 'Descarga un modulo de Klasa.',
			usage: '<Piece:piece>',
			extendedHelp: '+descargar languages',
			comando: '+descargar <Modulo>'
		});
	}

	async run(message, [piece]) {
		piece.unload();
		if (this.client.shard) {
			await this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) this.${piece.store}.get('${piece.name}').unload();
			`);
		}
		return message.sendMessage(message.language.get('COMMAND_UNLOAD', piece.type, piece.name));
	}

};
