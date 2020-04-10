const Discord= require('discord.js')
const keys = require('./keys.json')

const client = new Discord.Client()

client.on('ready', ()=>{
    console.log(`Bot ready, baby! Bienvenido ${client.user.tag}`)
});

client.on('message',(message)=>{
    
    if (message.content === 'ping') {
        // Send "pong" to the same channel
        message.channel.send('pong');
      }

      if (message.content.startsWith('!ola')){
        message.reply(`ola ke ase ${message.author.tag}`);
      }
})
console.log(keys)
client.login(keys.token)