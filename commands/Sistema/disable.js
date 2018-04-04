const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			name: 'deshabilitar',
			description: 'Re-deshabilita o deshabilita temporalmente un comando/inhibidor/monitor/finalizador/evento. El estado por defecto se restablece al reiniciar.',
			usage: '<Piece:piece>',
			extendedHelp: '+deshabilitar encuesta'
		});
		this.comando = '+deshabilitar <Modulo>';
		this.admins = true;
	}

	async run(msg, [piece]) {
		if ((piece.type === 'event' && piece.name === 'message') || (piece.type === 'monitor' && piece.name === 'commandHandler')) {
			return msg.sendMessage(msg.language.get('COMMAND_DISABLE_WARN'));
		}
		piece.disable();
		if (this.client.shard) {
			await this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) this.${piece.store}.get('${piece.name}').disable();
			`);
		}
		return msg.sendCode('diff', msg.language.get('COMMAND_DISABLE', piece.type, piece.name));
	}

};
