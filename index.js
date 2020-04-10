const Discord= require('discord.js')

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

client.login('Njk3NjU0MDg2MzA4MjAwNDY5.Xo6bMw.pr_uRvsuAYe63H_VWrkLCU_n0Oo')