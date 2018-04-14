const { Monitor } = require('klasa');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            name: 'nivel',
            enabled: true,
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: false,
            ignoreEdits: true
        });
    }

    async run(msg) {
        const MySql = await msg.client.providers.get('MySQL');
		if (msg.channel.name !== 'comandos' && msg.guild.name === 'Sea of Thieves ES' && !msg.author.bot) {
			const limpia = `\`\`\`fix\nSISTEMA DE NIVELES\n\`\`\`\n<:flechaarriba:406932788256702474> **${msg.author} ha subido de nivel.**\n\n<:garfio:407239812873977857> **Nivel `;
			const canal = msg.guild.channels.get('425298298446807041');
			const exists = await MySql.has3('XP', `${msg.author.id}`);
			if (exists) {
				const base = await MySql.get('XP', 'ID', `${msg.author.id}`);
				var xp = 10;
				if (MySql.update4('XP', `${msg.author.id}`, 'XP', `${String(parseInt(base.XP) + xp)}`)) {
					const base2 = await MySql.get('XP', 'ID', `${msg.author.id}`);
					if (parseInt(base2.XP) >= 23851 && parseInt(base2.XP) >= 67525 && !msg.member.roles.exists('id', '424585537035304962')) {
						msg.member.roles.add(await msg.guild.roles.find('id', '424585537035304962'));
						setTimeout(function () {msg.member.roles.add(msg.guild.roles.find('id', '424585482119413760'));}, 1000);
						canal.send(`${limpia}6:** Rey pirata.`);
					} else if (parseInt(base2.XP) >= 11825 && parseInt(base2.XP) >= 23850 && !msg.member.roles.exists('id', '424585482119413760') && !msg.member.roles.exists('id', '424585537035304962')) {
						msg.member.roles.add(await msg.guild.roles.find('id', '424585482119413760'));
						setTimeout(function () {msg.member.roles.remove(msg.guild.roles.find('id', '424585387596447765'));}, 1000);
						canal.send(`${limpia}5:** Pirata experto.`);
					} else if (parseInt(base2.XP) >= 4676 && parseInt(base2.XP) >= 11825 && !msg.member.roles.exists('id', '424585387596447765') && !msg.member.roles.exists('id', '424585482119413760') && !msg.member.roles.exists('id', '424585537035304962')) {
						msg.member.roles.add(await msg.guild.roles.find('id', '424585387596447765'));
						setTimeout(function () {msg.member.roles.remove(msg.guild.roles.find('id', '424585289852256268'));}, 1000);
						canal.send(`${limpia}4:** Pirata rufiÃ¡n.`);
					} else if (parseInt(base2.XP) >= 1151 && parseInt(base2.XP) >= 4675 && !msg.member.roles.exists('id', '424585289852256268') && !msg.member.roles.exists('id', '424585387596447765') && !msg.member.roles.exists('id', '424585482119413760') && !msg.member.roles.exists('id', '424585537035304962')) {
						msg.member.roles.add(await msg.guild.roles.find('id', '424585289852256268'));
						setTimeout(function () {msg.member.roles.remove(msg.guild.roles.find('id', '424585155408166922'));}, 1000);
						canal.send(`${limpia}3:** Grumete gallina.`);
					} else if (parseInt(base2.XP) >= 1 && parseInt(base2.XP) >= 1150 && !msg.member.roles.exists('id', '424585155408166922') && !msg.member.roles.exists('id', '424585289852256268') && !msg.member.roles.exists('id', '424585387596447765') && !msg.member.roles.exists('id', '424585482119413760') && !msg.member.roles.exists('id', '424585537035304962')) {
						msg.member.roles.add(await msg.guild.roles.find('id', '424585155408166922'));
						setTimeout(function () {msg.member.roles.remove(msg.guild.roles.find('id', '424585008984883203'));}, 1000);
						canal.send(`${limpia}2:** Rata de mar.`);
					}
				}
			} else {
				await MySql.insert2('XP', ['ID', 'XP'], [`${msg.author.id}`, '0']);
				msg.member.roles.add(await msg.guild.roles.find('id', '424585008984883203'));
				canal.send(`${limpia}1:** Limpiacubiertas.`);
			}
		}

    }

    async init() {
    }

};