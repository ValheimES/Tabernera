const { Command, Possible } = require('../../index');
const { MessageEmbed, SnowflakeUtil } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 3,
			aliases: ['tripulación'],
			subcommands: true,
			description: 'Permite administrar tripulaciones.',
			usage: '<listar|detalles|reclutar|expulsar|abandonar|establecer|crear|moderar|borrar> (pirata:pirata) (tripulacion:tripulacion) [...]',
			usageDelim: '|',
			extendedHelp: ['',
				'+tripulacion listar: Muestra un listado con todas las tripulaciones',
				'+tripulacion detalles | <nombre de tripulación>: Muestra una ficha con información detallada sobre una tripulación',
				'+tripulacion reclutar | <pirata>: Invita a un pirata a tu tripulación [sólo para capitanes]',
				'+tripulacion expulsar | <pirata>: Expulsa a un pirata de tu tripulación [sólo para capitanes]',
				'+tripulacion abandonar: Abandona la tripulación de la que formas parte [sólo para miembros]',
				'+tripulacion establecer | <logo|historia|imagen> | <texto>: Solicita cambios en la ficha de tripulación [sólo para capitanes]',
				'+tripulacion crear | <pirata> | <nombre de tripulación>: Crea una tripulación al mando del capitán pirata seleccionado [sólo para administradores]',
				'+tripulacion moderar | [nombre de tripulación]: Revisa cambios en las fichas de tripulación [sólo para administradores]',
				'+tripulacion borrar | <nombre de tripulación>: Borra a una tripulación y expulsa a sus miembros [sólo para administradores]',
			].join("\n"),
			comando: '+tripulacion <listar|detalles|reclutar|expulsar|abandonar|establecer|crear|moderar|borrar> | (argumentos)'
		});

		this
			.createCustomResolver('pirata', (arg, possible, msg, [type]) => {
				if (['listar', 'abandonar'].includes(type)) return undefined;

				if (['detalles', 'borrar'].includes(type)) {
					const customPossible = new Possible([undefined, "nombre de tripulación", "string", 1]);
					if (!arg) arg = '';

					return this.client.arguments.get('string').run(arg, customPossible, msg);
				}

				if (['moderar'].includes(type)) {
					if (!arg) return undefined; // Without args, show a list of pending requests

					const customPossible = new Possible([undefined, "nombre de tripulación", "string", 1]);
					return this.client.arguments.get('string').run(arg, customPossible, msg);
				}

				if (['establecer'].includes(type)) {
					if (!arg) arg = '';

					arg = arg.toLowerCase();
					if (!['logo', 'historia', 'imagen'].includes(arg))
						throw "Debes elegir una de estas opciones: (logo, historia, imagen)";

					return arg;
				}

				return this.client.arguments.get('member').run(arg, possible, msg);
			})
			.createCustomResolver('tripulacion', (arg, possible, msg, [type]) => {
				if (['crear'].includes(type)) {
					const customPossible = new Possible([undefined, "nombre de tripulación", "string", 1]);
					if (!arg) arg = '';

					return this.client.arguments.get('string').run(arg, customPossible, msg);
				}

				if (['establecer'].includes(type)) {
					const customPossible = new Possible([undefined, "texto", "string", 1]);
					if (!arg) arg = '';

					return this.client.arguments.get('string').run(arg, customPossible, msg);
				}

				return undefined;
			});
	}

	async listar(msg, []) {
		// Gather general crew config vars
		const crews = this.client.gateways.crews;
		await crews.sync();

		// Get sorted list of crews
		const sortedList = crews.cache.sort();

		// Early out if there aren't crews
		if (sortedList.size <= 0)
			throw "¡Yarr! Aún no hay ninguna tripulación mítica por estos mares...";

		const embed = new MessageEmbed()
			.setTitle('⚓ TRIPULACIONES MÍTICAS')
			.setColor(0x2b9d98)
			.setThumbnail("https://i.imgur.com/gVs4OQ5.png");
		sortedList.forEach(crew => embed.addField(crew.id, this.generateCrewShort(crew)));

		return msg.sendEmbed(embed);
	}

	generateCrewShort(crew) {
		const funnyNames = [
			// nameSingular, namePlural, adjective
			['bucanero', 'bucaneros', 'alegre'],
			['caballero de fortuna', 'caballeros de fortuna', 'experto'],
			['corsario', 'corsarios', 'legendario'],
			['criminal', 'criminales', 'maestro'],
			['filibustero', 'filibusteros', 'odioso'],
			['lobo de mar', 'lobos de mar', 'renombrado'],
			['marinero', 'marineros', 'sanguinario'],
			['pirata', 'piratas', 'sucio'],
		];

		const ownerConstant = SnowflakeUtil.deconstruct(crew.owner).timestamp;

		const captainIndex = ownerConstant % 8;
		let companionsIndex = Math.trunc(ownerConstant / 8) % 8;
		const adjectiveIndex = Math.trunc(ownerConstant / 64) % 8;

		if (companionsIndex == captainIndex)
			companionsIndex = (companionsIndex + 1) % companionsFunnyNames.length;

		const numCompanions = crew.members.length;
		if (numCompanions == 1) {
			return `del ${funnyNames[adjectiveIndex][2]} ${funnyNames[captainIndex][0]} <@${crew.owner}>`;
		}
		else if(numCompanions == 2) {
			return `del ${funnyNames[adjectiveIndex][2]} ${funnyNames[captainIndex][0]} <@${crew.owner}> y otro ${funnyNames[companionsIndex][0]}`;
		}
		else {
			return `del ${funnyNames[adjectiveIndex][2]} ${funnyNames[captainIndex][0]} <@${crew.owner}> y ${numCompanions - 1} ${funnyNames[companionsIndex][1]} más`;
		}
	}

	async detalles(msg, [crewName]) {
		// Gather general crew config vars
		const crews = this.client.gateways.crews;
		await crews.sync();

		// Make sure the crew exists
		const crew = crews.get(crewName);
		if (!crew)
			throw "Mmmm... no recuerdo ninguna tripulación mítica con ese nombre... ¡Ah, sí! Son los que fueron a buscar pollos a Paradise Spring y se perdieron, ¿no?";

		// Generate crew details
		const embed = this.generateCrewDetails(msg.guild, crew, false);
		return msg.sendEmbed(embed);
	}

	generateCrewDetails(guild, crew, usePendingData) {
		const { emojiCrewDetail } = guild.configs.crews;
		const captain = guild.member(crew.owner);

		let { crewDescription, crewLogo, crewImage } = crew;
		if (!crewDescription)
			crewDescription = "Es una tripulación misteriosa de la que se conoce poco más que la desagradable halitosis de su capitán.";
		if (!crewLogo)
			crewLogo = "https://i.imgur.com/INxHGkP.png";
		if (!crewImage)
			crewImage = "https://i.imgur.com/qS3B18t.jpg";

		if (usePendingData) {
			if (crew.pendingCrewImage)
				crewImage = crew.pendingCrewImage;
			if (crew.pendingCrewLogo)
				crewLogo = crew.pendingCrewLogo;
			if (crew.pendingCrewDescription)
				crewDescription = crew.pendingCrewDescription;
		}

		const embed = new MessageEmbed()
			.setTitle(`${emojiCrewDetail} Ficha de ${crew.id}`)
			.setDescription("Si quieres unirte a esta tripulación contacta con su capitán.")
			.setThumbnail(crewLogo)
			.addField("Miembros", crew.members.map(memberID => `- <@${memberID}>${memberID === captain.id ? " 👑" : ""}`).join("\n"))
			.addField("Historia", crewDescription)
			.addField("Foto del grupo", "📸")
			.setImage(crewImage)
			.setFooter(`Capitán de la tripulación: ${captain.displayName}`, captain.user.displayAvatarURL())
		;
		return embed;
	}

	async reclutar(msg, [member]) {
		// Gather general crew config vars
		const { invitationExpirationSeconds, emojiAccept, emojiReject } = msg.guild.configs.crews;
		const crews = this.client.gateways.crews;
		await crews.sync();

		// Get user's crew and make sure they're a crew captain
		const userCrew = crews.cache.find(crew => crew.owner === msg.author.id);
		if (!userCrew)
			throw '¡Impostor! ¡No eres capitán de ninguna tripulación!';

		// Check the target is valid
		if (msg.author.id === member.id)
			throw 'Está claro que eres el mejor pirata de los mares, pero necesitarás a otros en tu tripulación para limpiar las cubiertas.';

		if (userCrew.members.includes(member.id))
			throw `¿Te falla la memoria? ¡${member} ya forma parte de tu tripulación! Reduce tu consumo de grog...`;

		const targetCrew = crews.cache.find(crew => crew.members.includes(member.id));
		if (targetCrew)
			throw `¡Gran elección! Pero ${member} ya es parte de la tripulación <@&${targetCrew.role}> y tendría que abandonarla primero.`;

		// Send invitation
		const message = await msg.sendMessage(`¡Ojo al parche, ${member}! ¡${msg.author} quiere que te unas a su tripulación, <@&${userCrew.role}>! ¿Aceptas?`);
		const reactionAccept = emojiAccept ? emojiAccept : '👍';
		const reactionReject = emojiReject ? emojiReject : '👎';
		const validReactions = [reactionAccept, reactionReject];
		await message.react(reactionAccept);
		await message.react(reactionReject);

		// Wait for a response
		const reacts = await message.awaitReactions(
			(reaction, user) => member.user.id === user.id && (validReactions.includes(reaction.emoji.id) || validReactions.includes(reaction.emoji.name)),
			{ max: 1, time: (invitationExpirationSeconds ? invitationExpirationSeconds : 300) * 1000 });

		// Delete invitation
		message.delete();

		// Exit if the target rejected or the invitation expired
		if (reacts.has(reactionReject))
			return msg.channel.send(`¡Diantres! ¡${member} rechazó su oferta de unirse a <@&${userCrew.role}>, capitán ${msg.author}!`);

		if (!reacts.has(reactionAccept))
			return msg.channel.send(`¡Argh! Capitán ${msg.author}, ${member} no se ha decidido a tiempo sobre unirse a <@&${userCrew.role}>. La oferta ha sido retirada.`);

		// Last check in case the target has already joined another crew
		await crews.sync();
		const joinedCrew = crews.cache.find(crew => crew.members.includes(member.id));
		if (joinedCrew) {
			if (joinedCrew.role === userCrew.role) return; // Don't show any message if the crew the target has already joined is ours
			return msg.channel.send(`¡Alto ahí! Capitán ${msg.author}, ${member} se había unido a escondidas a <@&${joinedCrew.role}>. ¡Qué pillastre!`);
		}

		// Assign roles and update database
		await member.roles.add(userCrew.role);
		await crews.get(userCrew.id).update('members', member);

		// Success!
		return msg.channel.send(`¡${member} se ha unido a la tripulación <@&${userCrew.role}>! ¿Qué grandes aventuras le esperarán?`);
	}

	async expulsar(msg, [member]) {
		// Gather general crew config vars
		const { channelKickedVoice } = msg.guild.configs.crews;
		const crews = this.client.gateways.crews;
		await crews.sync();

		// Get user's crew and make sure they're a crew captain
		const userCrew = crews.cache.find(crew => crew.owner === msg.author.id);
		if (!userCrew)
			throw '¡Impostor! ¡No eres capitán de ninguna tripulación!';

		// Check the target is valid
		if (msg.author.id === member.id)
			throw `Este aciago día será recordado con tristeza por siempre, ya que ${msg.author} intentó expulsarse de su propia tripulación... y fracasó.`;

		if (!userCrew.members.includes(member.id))
			throw `Tras tu intenso y apasionado discurso expulsándole de <@&${userCrew.role}>, ${member} se encoge de hombros y te ignora, ¡ya que no pertenece a tu tripulación!`;

		// Remove role and update database
		await member.roles.remove(userCrew.role);
		await crews.get(userCrew.id).update('members', member.user);

		// If the target is connected to the crew's voice channel, kick them
		if (member.voiceChannel && member.voiceChannel.id === userCrew.channelVoice)
			await member.setVoiceChannel(channelKickedVoice);

		// Success!
		return msg.sendMessage(`¡Por las barbas de Merrick, ${member} ha sido expulsado de <@&${userCrew.role}>! No te preocupes, ¡la próxima ronda es gratis! ¡Quédate en mi taberna bebiendo grog del bueno hasta que otro te recoja en su barco!`);
	}

	async abandonar(msg, []) {
		// Gather general crew config vars
		const { channelKickedVoice } = msg.guild.configs.crews;
		const crews = this.client.gateways.crews;
		await crews.sync();

		// Get user's crew and make sure they're part of a crew
		const userCrew = crews.cache.find(crew => crew.members.includes(msg.author.id));
		if (!userCrew)
			throw '¡Truhán! ¡No eres parte de ninguna tripulación!';

		// Don´t let the captain leave
		if (userCrew.owner === msg.author.id)
			throw `¿Cómo puedes siquiera plantearte abandonar a tu tripulación? Si realmente deseas hacerlo, deberás hablar con un administrador.`;

		// Remove role and update database
		const member = msg.guild.member(msg.author);
		await member.roles.remove(userCrew.role);
		await crews.get(userCrew.id).update('members', member.user);

		// If the user is connected to the crew's voice channel, kick them
		if (member.voiceChannel && member.voiceChannel.id === userCrew.channelVoice)
			await member.setVoiceChannel(channelKickedVoice);

		// Success!
		return msg.sendMessage(`¡Rayos y truenos! ¡${member} ha desertado de la tripulación <@&${userCrew.role}>! Se rumorea que su capitán les obligaba a llevar patas de palo a juego... ¡Qué canalla!`);
	}

	async establecer(msg, [option, text]) {
		// Gather general crew config vars
		const { channelReportAdmin } = msg.guild.configs.crews;
		const crews = this.client.gateways.crews;
		await crews.sync();

		// Get user's crew and make sure they're a crew captain
		const userCrew = crews.cache.find(crew => crew.owner === msg.author.id);
		if (!userCrew)
			throw '¡Impostor! ¡No eres capitán de ninguna tripulación!';

		// Validate image URL if option is logo or image
		if (['logo', 'imagen'].includes(option)) {
			const imageURL = new URL(text);
			if (!/\.(png|jpg|jpeg|gif|bmp|webp)$/.test(imageURL.pathname))
				throw 'El texto introducido no parece un URL de imagen válido.';
		}

		// Store in DB
		const crew = crews.get(userCrew.id, true);
		if (crew._syncStatus) await crew._syncStatus;
		switch (option) {
			case 'logo':
			await crew.update('pendingCrewLogo', text);
			break;

			case 'historia':
			await crew.update('pendingCrewDescription', text);
			break;

			case 'imagen':
			await crew.update('pendingCrewImage', text);
			break;

			default:
			throw '¡Diantres! ¡No entiendo la opción que has elegido!';
		}

		// Report at admin channel
		const reportChannel = channelReportAdmin ? msg.guild.channels.find(channel => channel.id === channelReportAdmin) : undefined;
		if (reportChannel)
			reportChannel.sendMessage(`[TRIPULACIONES] El capitán de <@&${crew.role}> ha solicitado cambios en la ficha de tripulación que requieren aprobación.`);

		// Success!
		return msg.sendMessage('¡Harr! He apuntado tu solicitud y será revisada pronto por el Señor de los Piratas. Puede tardar un poco, así que... ¿por qué no partes con viento fresco a arrumar tu bajel?');
	}

	async crear(msg, [member, crewName]) {
		// This command is for admins only, check permission level 6
		const { permission } = await this.client.permissionLevels.run(msg, 6);
		if (!permission)
			throw msg.language.get('INHIBITOR_PERMISSIONS');

		// Gather general crew config vars
		const { roleColor, roleBelow: roleBelowID, channelParentText, channelParentVoice } = msg.guild.configs.crews;
		const crews = this.client.gateways.crews;
		await crews.sync();

		// Check whether the crew already exists
		if (crews.cache.has(crewName))
			throw `¡Argh! ¡Me parece haber visto esta tripulación antes en esta taberna! ¡Sea más original, señor!`;

		// Check whether the player is already a member of any crew
		const memberCrew = crews.cache.find(crew => crew.members.includes(member.id));
		if (memberCrew)
			throw `${member} ya es miembro de <@&${memberCrew.role}>, ¡estar en tantas tripulaciones a la vez sería demasiada diversión!`;

		// Create crew role and assign it to the player
		const roleBelow = msg.guild.roles.get(roleBelowID);
		const newRolePosition = roleBelow ? (roleBelow.position + 1) : 1;

		const role = await msg.guild.roles.create({ data: {
			name: crewName,
			color: roleColor,
			position: newRolePosition,
			hoist: true,
			mentionable: true
		}});

		await member.roles.add(role);

		// Create crew channels
		const textChannel = await msg.guild.channels.create(crewName, {
			type: 'text',
			parent: channelParentText,
			overwrites: [{ id: msg.guild.id, denied: ['VIEW_CHANNEL'] }, { id: role.id, allowed: ['VIEW_CHANNEL'] }]
		});

		const voiceChannel = await msg.guild.channels.create(crewName, {
			type: 'voice',
			parent: channelParentVoice,
			userLimit: 10,
			overwrites: [{ id: msg.guild.id, denied: ['CONNECT'] }, { id: role.id, allowed: ['CONNECT'] }]
		});

		// Create the crew in the database, and store initial data
		const crew = crews.get(crewName, true);
		if (crew._syncStatus) await crew._syncStatus;
		await crew.update('role', role);
		await crew.update('channelText', textChannel);
		await crew.update('channelVoice', voiceChannel);
		await crew.update('owner', member);
		await crew.update('members', member);

		// Success!
		return msg.sendMessage(`¡Listo! ¡Parece que ${member} sabe nadar y distinguir cuál es el grog bueno! Desde hoy, ¡${member} capitaneará ${role}! ¡Mucha suerte surcando los mares!`);
	}

	async moderar(msg, [crewName]) {
		// This command is for admins only, check permission level 6
		const { permission } = await this.client.permissionLevels.run(msg, 6);
		if (!permission)
			throw msg.language.get('INHIBITOR_PERMISSIONS');

		// Gather general crew config vars
		const { channelReportAdmin, emojiAccept, emojiReject } = msg.guild.configs.crews;
		const crews = this.client.gateways.crews;
		await crews.sync();

		// Confirm there's an admin channel for interaction
		const reportChannel = channelReportAdmin ? msg.guild.channels.find(channel => channel.id === channelReportAdmin) : undefined;
		if (!reportChannel)
			throw '¡Maldición! ¿Por qué no crea un canal de administración donde podamos hablar en privado, señor?';

		// List mode
		if (!crewName) {
			// Get sorted list of crews with pending changes
			const pendingCrews = crews.cache.filter(crew => crew.pendingCrewLogo || crew.pendingCrewDescription || crew.pendingCrewImage).sort();

			// Early out if there aren't crews with pending changes
			if (pendingCrews.size <= 0)
				throw "¡Salud! No hay cambios pendientes de revisar...";

			const embed = new MessageEmbed()
				.setTitle('⚓ TRIPULACIONES MÍTICAS - CAMBIOS PENDIENTES')
				.setColor(0x2b9d98)
				.setThumbnail("https://i.imgur.com/gVs4OQ5.png");

			pendingCrews.forEach(crew => {
				let pending = [];
				if (crew.pendingCrewLogo) pending.push("Logo");
				if (crew.pendingCrewDescription) pending.push("Historia");
				if (crew.pendingCrewImage) pending.push("Imagen");
				pending = pending.join(" + ");

				embed.addField(crew.id, pending)
			});

			if (reportChannel !== msg.channel) {
				msg.sendMessage(`Hablemos en privado, ${msg.author}.`);
				reportChannel.sendMessage(`[${msg.author}]`);
			}

			return reportChannel.sendEmbed(embed);
		}

		// Review mode

		// Make sure the crew exists and has pending changes
		const crew = crews.get(crewName);
		if (!crew)
			throw "¡Argh! Deje el grog, señor, pues no existe ninguna tripulación con tal nombre.";

		if (!crew.pendingCrewLogo && !crew.pendingCrewDescription && !crew.pendingCrewImage)
			throw "Esa tripulación no tiene cambios pendientes de aprobación, señor.";

		// Generate crew details
		if (reportChannel !== msg.channel) {
			msg.sendMessage(`Hablemos en privado, ${msg.author}.`);
			reportChannel.sendMessage(`[${msg.author}]`);
		}

		const embed = this.generateCrewDetails(msg.guild, crew, true);
		await reportChannel.sendMessage(`Esta es la ficha de <@&${crew.role}> con los cambios que su capitán ha solicitado.`);
		await reportChannel.sendEmbed(embed);

		// Ask interactive responses
		const reactionAccept = emojiAccept ? emojiAccept : '👍';
		const reactionReject = emojiReject ? emojiReject : '👎';
		const validReactions = [reactionAccept, reactionReject];

		const crewChannel = crew.channelText ? msg.guild.channels.find(channel => channel.id === crew.channelText) : undefined;

		if(crew.pendingCrewLogo) {
			const message = await reportChannel.sendMessage("¿Acepta el cambio de logo, señor?");
			await message.react(reactionAccept);
			await message.react(reactionReject);

			message.awaitReactions(
				(reaction, user) => msg.author.id === user.id && (validReactions.includes(reaction.emoji.id) || validReactions.includes(reaction.emoji.name)),
				{ max: 1, time: (300) * 1000 })
			.then(async (reacts) => {
				if (reacts.has(reactionReject)) {
					await crew.update("pendingCrewLogo", null);
					message.edit("La solicitud de cambio de logo ha sido rechazada.");
					message.reactions.removeAll();
					if (crewChannel) crewChannel.sendMessage("La solicitud de cambio de logo ha sido rechazada.");
				}
				else if (!reacts.has(reactionAccept)) {
					message.edit("La operación de moderación ha caducado.");
					message.reactions.removeAll();
				}
				else {
					await crew.update("crewLogo", crew.pendingCrewLogo);
					await crew.update("pendingCrewLogo", null);
					message.edit("La solicitud de cambio de logo ha sido aprobada.");
					message.reactions.removeAll();
					if (crewChannel) crewChannel.sendMessage("La solicitud de cambio de logo ha sido aprobada.");
				}
			});
		}

		if(crew.pendingCrewDescription) {
			const message = await reportChannel.sendMessage("¿Acepta el cambio de historia, señor?");
			await message.react(reactionAccept);
			await message.react(reactionReject);

			message.awaitReactions(
				(reaction, user) => msg.author.id === user.id && (validReactions.includes(reaction.emoji.id) || validReactions.includes(reaction.emoji.name)),
				{ max: 1, time: (300) * 1000 })
			.then(async (reacts) => {
				if (reacts.has(reactionReject)) {
					await crew.update("pendingCrewDescription", null);
					message.edit("La solicitud de cambio de historia ha sido rechazada.");
					message.reactions.removeAll();
					if (crewChannel) crewChannel.sendMessage("La solicitud de cambio de historia ha sido rechazada.");
				}
				else if (!reacts.has(reactionAccept)) {
					message.edit("La operación de moderación ha caducado.");
					message.reactions.removeAll();
				}
				else {
					await crew.update("crewDescription", crew.pendingCrewDescription);
					await crew.update("pendingCrewDescription", null);
					message.edit("La solicitud de cambio de historia ha sido aprobada.");
					message.reactions.removeAll();
					if (crewChannel) crewChannel.sendMessage("La solicitud de cambio de historia ha sido aprobada.");
				}
			});
		}

		if(crew.pendingCrewImage) {
			const message = await reportChannel.sendMessage("¿Acepta el cambio de imagen, señor?");
			await message.react(reactionAccept);
			await message.react(reactionReject);

			message.awaitReactions(
				(reaction, user) => msg.author.id === user.id && (validReactions.includes(reaction.emoji.id) || validReactions.includes(reaction.emoji.name)),
				{ max: 1, time: (300) * 1000 })
			.then(async (reacts) => {
				if (reacts.has(reactionReject)) {
					await crew.update("pendingCrewImage", null);
					message.edit("La solicitud de cambio de imagen ha sido rechazada.");
					message.reactions.removeAll();
					if (crewChannel) crewChannel.sendMessage("La solicitud de cambio de imagen ha sido rechazada.");
				}
				else if (!reacts.has(reactionAccept)) {
					message.edit("La operación de moderación ha caducado.");
					message.reactions.removeAll();
				}
				else {
					await crew.update("crewImage", crew.pendingCrewImage);
					await crew.update("pendingCrewImage", null);
					message.edit("La solicitud de cambio de imagen ha sido aprobada.");
					message.reactions.removeAll();
					if (crewChannel) crewChannel.sendMessage("La solicitud de cambio de imagen ha sido aprobada.");
				}
			});
		}
	}

	async borrar(msg, [crewName]) {
		// This command is for admins only, check permission level 6
		const { permission } = await this.client.permissionLevels.run(msg, 6);
		if (!permission)
			throw msg.language.get('INHIBITOR_PERMISSIONS');

		// Gather general crew config vars
		const crews = this.client.gateways.crews;
		await crews.sync();

		// Make sure the crew exists
		const crew = crews.get(crewName);
		if (!crew)
			throw "¡Argh! Deje el grog, señor, pues no existe ninguna tripulación con tal nombre.";

		// Delete channels and role
		const textChannel = msg.guild.channels.get(crew.channelText);
		if (textChannel)
			await textChannel.delete();

		const voiceChannel = msg.guild.channels.get(crew.channelVoice);
		if (voiceChannel)
			await voiceChannel.delete();

		const role = msg.guild.roles.get(crew.role);
		if (role)
			await role.delete();

		// Delete crew from DB
		crew.destroy();

		return msg.sendMessage(`La tripulación de ${crewName} ha sido disuelta por orden del Señor de los Piratas, ¡esos indeseables serán pasados por la quilla!`);
	}
};
