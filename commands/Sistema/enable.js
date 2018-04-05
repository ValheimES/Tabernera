const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			name: 'habilitar',
			description: 'Rehabilita o habilita temporalmente un comando/inhibidor/monitor/finalizador. El estado por defecto se restablece al reiniciar.',
			usage: '<Piece:piece>',
			extendedHelp: '+habilitar encuesta'
		});
		this.comando = '+habilitar <Modulo>';
		this.admins = true;
	}

	async run(msg, [piece]) {
		piece.enable();
		if (this.client.shard) {
			await this.client.shard.broadcastEval(`if (this.shard.id !== ${this.client.shard.id}) this.${piece.store}.get('${piece.name}').enable();`);
		}
		return msg.sendCode('diff', msg.language.get('COMMAND_ENABLE', piece.type, piece.name));
	}

};
