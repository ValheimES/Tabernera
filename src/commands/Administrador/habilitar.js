const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['enable'],
			permissionLevel: 9,
			guarded: true,
			description: language => language.get('COMMAND_ENABLE_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	async run(message, [piece]) {
		piece.enable();
		return message.sendCode('diff', message.language.get('COMMAND_ENABLE', piece.type, piece.name));
	}

};
