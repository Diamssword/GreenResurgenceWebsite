import { SlashCommandAttachmentOption, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import type { Command } from "../../app";
import * as fs from "fs"
import { VITE_BASE_URL } from "$env/static/private";
export default {
    command: new SlashCommandBuilder().setName("modif_image").setDescription("Remplace une image sans changer son lien")
        .addAttachmentOption(new SlashCommandAttachmentOption().setName("image").setDescription("la nouvelle image, doit avoir la même extension que l'ancienne (png,jpg...)").setRequired(true))
        .addStringOption(new SlashCommandStringOption().setName("id").setDescription("l'id de l'image à remplacer").setRequired(true)).setDMPermission(false),
    async action(ctx) {
        const img = ctx.options.getAttachment("image", true)
        const title = ctx.options.getString("id", true)
        if (!img || !title) {
            return await ctx.reply({ content: "Pas d'image ou d'id!", ephemeral: true })
        }
        if (img.size <= 51000000)  //51 MO max
        {
            var res = findImage(title, img.contentType?.split("/")[1]);
            if (typeof res == "string") {
                try {
                    await ctx.deferReply({ ephemeral: true })
                    await saveImage(img.url, res)
                    const link = VITE_BASE_URL + "/files/image/" + res;
                    await ctx.editReply({ content: "Image modifié!\nLien (toujours le même):" + link })

                } catch (err) {
                    console.error(err)
                    await ctx.reply({ content: "Echec de l'envoi!", ephemeral: true })
                }
            }
            else {
                if (res.error == "ext")
                    await ctx.reply({ content: "L'extension des 2 images sont differentes!", ephemeral: true })
                else
                    await ctx.reply({ content: "Ancienne image introuvable!", ephemeral: true })
            }


        }
        else
            await ctx.reply({ content: "Le fichier doit faire 51Mo max!", ephemeral: true })
    },
} as Command
function findImage(id: string, ext: string) {
    id = id.trim().split(".")[0];    
    if (fs.existsSync("./uploaded/images")) {
        var img = fs.readdirSync("./uploaded/images").filter(v => v.split(".")[0] == id)[0];
        if (img) {
            if (img.split(".")[1] == ext) {
                return img;
            }
            else
                return { error: "ext" }
        }
        else
            return { error: "notfound" }
    }
    else
        return { error: "notfound" }

}
function saveImage(url: string, path: string) {
    return new Promise<void>((res, err) => {
        fetch(url).then(async im => {

            fs.writeFileSync("./uploaded/images/" + path, Buffer.from(await im.arrayBuffer()))
            res()
        }).catch(err)
    })



    console.log()
}