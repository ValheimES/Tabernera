const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 9,
			guarded: true,
			description: language => language.get('COMMAND_DISABLE_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	async run(message, [piece]) {
		if ((piece.type === 'event' && piece.name === 'message') || (piece.type === 'monitor' && piece.name === 'commandHandler'))
			return message.sendLocale('COMMAND_DISABLE_WARN');

		piece.disable();
		return message.sendLocale('COMMAND_DISABLE', [piece.type, piece.name], { code: 'diff' });
	}

};
