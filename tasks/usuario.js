const { Task } = require('klasa');

module.exports = class extends Task {

    constructor(...args) {
        super(...args, {
			name: 'usuario',
			enabled: true
		});
    }

    async run({guild}) {
        let members = guild.members.array();

		for (let i = 0; i < members.length; i++) {
			if (!members[i].roles.exists('name', 'ðŸ™ Usuario')) {
				await members[i].roles.add(msg.guild.roles.find('name', 'ðŸ™ Usuario'));
			}
		}

		return true;
    }

};