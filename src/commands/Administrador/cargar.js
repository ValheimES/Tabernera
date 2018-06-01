const { Command, Stopwatch } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			aliases: ['carga'],
			description: 'Carga un comando/inhibidor/monitor/finalizador.',
			usage: '<Piece:piece>',
			extendedHelp: '+carga encuesta',
			comando: '+load <Módulo>'
		});
		this.regExp = /\\\\?|\//g;
	}

	async run(message, [core, store, path]) {
		path = (path.endsWith('.js') ? path : `${path}.js`).split(this.regExp);
		core = Boolean(core);
		const timer = new Stopwatch();
		const piece = store.load(path, core);

		try {
			if (!piece) throw message.language.get('COMMAND_LOAD_FAIL');
			await piece.init();
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) {
						const piece = this.${piece.store}.load(${JSON.stringify(path)}, ${core});
						if (piece) piece.init();
					}
				`);
			}
			return message.sendMessage(message.language.get('COMMAND_LOAD', timer.stop(), store.name, piece.name));
		} catch (error) {
			timer.stop();
			throw message.language.get('COMMAND_LOAD_ERROR', store.name, piece ? piece.name : path.join('/'), error);
		}
	}

};
