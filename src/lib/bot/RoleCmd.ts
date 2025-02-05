import { SlashCommandBuilder, SlashCommandStringOption} from "discord.js";
import db from "$lib/DB";
import type { Command } from "../../app";
export default {
    command: new SlashCommandBuilder().setName("set_role").setDescription("Change le role d'un joueur")
        .addStringOption(new SlashCommandStringOption().setName("pseudo_mc").setDescription("le pseudo MC du joueur").setRequired(true))
        .addStringOption(new SlashCommandStringOption().setName("role").setDescription("le role a attribuer").addChoices({ name: "Modérateur", value: "modo" }, { name: "Aucun", value: "none" }).setRequired(true)).setDMPermission(false),
    async action(ctx) {
        const pseudo = ctx.options.getString("pseudo_mc", true)
        const role = ctx.options.getString("role", true)
        if (!pseudo || !role) {
            return await ctx.reply({ content: "paramètres manquant", ephemeral: true })
        }

        await ctx.deferReply();
        fetch("https://api.mojang.com/users/profiles/minecraft/" + pseudo).then(async v => {
            var js = await v.json();
            if (js && js.id) {
                try{
                db.prepare('INSERT OR REPLACE INTO roles (uuid, role, username) VALUES (?, ?, ?)').run(js.id, role, pseudo);
                ctx.editReply({ content: `Role de **${pseudo}** avec l'UUID **${js.id}** mis à **${role}**`});
                }catch(err)
                {
                    console.error(err);
                    ctx.editReply({ content: "Une erreur c'est produite"})
                }
            }
            else {
                ctx.editReply({ content: "Pseudo introuvable: "+pseudo});
            }
        }).catch(err => {
            console.log(err);
            ctx.editReply({ content: "Une erreur c'est produite"})
        });
    }
} as Command
