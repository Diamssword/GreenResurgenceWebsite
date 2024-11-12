import { SlashCommandBuilder, SlashCommandStringOption} from "discord.js";
import db from "$lib/DB";
import type { Command } from "../../app";
export default {
    command: new SlashCommandBuilder().setName("list_roles").setDescription("Vois tout les roles attribués").setDMPermission(false),
    async action(ctx) {
        
        await ctx.deferReply();
        db.all('SELECT * FROM roles', [], (err, rows) => {
            if (err) {
                ctx.editReply({ content: "Une erreur c'est produite"})
                console.error(err.message);
            }
            else
            {
            var list="";
            rows.forEach((row) => {
                list=list+"**"+row.username+"** : **"+row.role+"** (uuid: "+row.uuid+")\n";
            });
            ctx.editReply({ content: list});
        }
        });
    }
} as Command
