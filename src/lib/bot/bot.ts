import { ALLOWED_DISCORD, DISCORD_ID, DISCORD_TOKEN } from '$env/static/private';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import uploadCmd from "$lib/bot/uploadCmd"
import type { Command } from '../../app';
import changeCmd from '$lib/bot/changeCmd';
import RoleCmd from './RoleCmd';
import RoleListCmd from './RoleListCmd';
const commands=[
    uploadCmd,
    changeCmd,
    RoleCmd,
    RoleListCmd
] as Command[]
console.info("Starting Discord Bot...")
async function start()
{
    const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
    ALLOWED_DISCORD.split(",").forEach(guild=>{
        rest.put(Routes.applicationGuildCommands(DISCORD_ID,guild), { body: commands.map(c=>c.command) });
    })
    


const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.on('ready', () => {
    console.info(`Stared Bot as ${client.user.tag}!`);
    client.guilds.fetch().then(g=>console.log("Guilds:"+g.map(g1=>g1.id+":"+g1.name).join("\n")))
});
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    var cmd=commands.find(c=>c.command.name==interaction.commandName);
    if(cmd)
    {
        try{
        await cmd.action(interaction);
        }catch(err){
            console.error("Command Failed: "+cmd.command.name)
            console.error(err)
        }
    }
    else
        await interaction.reply("Commande inconnu")
  });

  client.login(DISCORD_TOKEN).catch(console.error)
}
if(DISCORD_ID && DISCORD_TOKEN)
    start().catch(console.error);
else
    console.warn("Les tokens bots sont inexistant, bot désactivé.")