import { SlashCommandBuilder, SlashCommandStringOption} from "discord.js";
import db from "$lib/DB";
import type { Command } from "../../app";
export default {
    command: new SlashCommandBuilder().setName("list_roles").setDescription("Vois tout les roles attribués").setDMPermission(false),
    async action(ctx) {
        
        await ctx.deferReply();
        try{
            var rows=db.prepare('SELECT * FROM roles').all();
            var list="";
            rows.forEach((row:any) => {
                list=list+"**"+row.username+"** : **"+row.role+"** (uuid: "+row.uuid+")\n";
            });
            ctx.editReply({ content: list});
        }catch(err){
            ctx.editReply({ content: "Une erreur c'est produite"})
            console.error(err.message);
        }
    }
} as Command
