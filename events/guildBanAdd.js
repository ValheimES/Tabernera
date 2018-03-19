const { Event } = require("klasa");
module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      enabled: true
    });
  }
  run(member) {
    const channel = member.guild.channels.get('405850852411179040');
    if (!channel) return;
    channel.send("```fix\nPASEÓ POR LA PLANCHA\n```\n<:barco:406838651771682818> **¡Alto ahí! Más os vale saltar por la borda**\n\n_El pirata" + `${member}` + "es condenado a criar malvas devorado por los tiburones por traidor. Sus restos son recuperados y usados para decorar la {#taberna}._ 🦈\n\nhttp://gph.is/2Ged67e\n");
  }
};
