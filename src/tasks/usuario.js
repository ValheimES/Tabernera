const { Task } = require('klasa');

module.exports = class extends Task {

	async run({ guildID }) {
		const guild = this.client.guilds.get(guildID);
		if (!guild) return false;

		const role = guild.roles.get(guild.configs.roles.inicial[0]);
		if (!role) return false;

		for (const member of guild.members.values())
			if (!member.roles.has(role.id)) await member.roles.add(role);

		return true;
	}

	// async init() {
	// 	const { tasks } = this.client.schedule;
	// 	if (!tasks.some(task => task.taskName === 'usuario'))
	// 		await this.client.schedule.create('usuario', '*/10 * * * *');
	// }

};
