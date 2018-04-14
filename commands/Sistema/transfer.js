const Comando = require('../../estructuras/Comando');
const fs = require('fs-nextra');
const { resolve, join } = require('path');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			name: 'transferir',
			description: 'Transfiere un modulo principal a su respectiva carpeta',
			usage: '<Piece:piece>',
			extendedHelp: '+transfer ayuda'
		});
		this.comando = '+transferir <Modulo>';
		this.admins = true;
	}

	async run(msg, [piece]) {
		const file = join(...piece.file);
		const fileLocation = resolve(piece.store.coreDir, file);
		await fs.access(fileLocation).catch(() => { throw msg.language.get('COMMAND_TRANSFER_ERROR'); });
		try {
			await fs.copy(fileLocation, join(piece.store.userDir, file));
			piece.store.load(piece.file);
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.store}.load(${JSON.stringify(piece.file)});
				`);
			}
			return msg.sendMessage(msg.language.get('COMMAND_TRANSFER_SUCCESS', piece.type, piece.name));
		} catch (err) {
			this.client.emit('error', err.stack);
			return msg.sendMessage(msg.language.get('COMMAND_TRANSFER_FAILED', piece.type, piece.name));
		}
	}

};
