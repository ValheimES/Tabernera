const { Event, util: { codeBlock } } = require('../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

	run(guild, user) {
		const channel = guild.channels.get(guild.configs.channels.puerto);
		if (channel) {
			channel.send(new MessageEmbed()
				.setColor(0xFF0D00)
				.setImage('https://media.giphy.com/media/l41ovTcnPgjk6rzb2/giphy.gif')
				.setDescription([
					codeBlock('fix', 'PASEÓ POR LA PLANCHA'),
					'<:barco:406838651771682818> **¡Alto ahí! Más os vale saltar por la borda**',
					`\n_El pirata ${user.username} es condenado a criar malvas devorado por los tiburones por traidor. Sus restos son recuperados y usados para decorar la <#375828283704475649>._ 🦈`
				].join('\n'))
			);
		}
	}

};
