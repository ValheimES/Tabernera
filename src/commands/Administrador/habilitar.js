const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			description: 'Rehabilita o habilita temporalmente un comando/inhibidor/monitor/finalizador. El estado por defecto se restablece al reiniciar.',
			usage: '<Piece:piece>',
			extendedHelp: '+habilitar encuesta',
			comando: '+habilitar <Módulo>'
		});
	}

	async run(msg, [piece]) {
		piece.enable();
		return msg.sendCode('diff', msg.language.get('COMMAND_ENABLE', piece.type, piece.name));
	}

};
