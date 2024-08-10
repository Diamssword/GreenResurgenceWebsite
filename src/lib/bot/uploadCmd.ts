import { SlashCommandAttachmentOption, SlashCommandBuilder, SlashCommandStringOption, userMention } from "discord.js";
import type { Command } from "../../app";
import ShortUniqueId from "short-unique-id";
import * as path from "path"
import * as fs from "fs"
import { VITE_BASE_URL } from "$env/static/private";
import { EmbedBuilder } from "@discordjs/builders";
export default {
    command:new SlashCommandBuilder().setName("ajout_image").setDescription("Envoie une image au serveur et créer un lien direct en retour")
    .addAttachmentOption(new SlashCommandAttachmentOption().setName("image").setDescription("l'image à envoyer").setRequired(true))
    .addStringOption(new SlashCommandStringOption().setName("titre").setDescription("Un titre pour retrouver facilement l'image").setRequired(true)).setDMPermission(false),
    async action(ctx) {
        const img=ctx.options.getAttachment("image",true)
        const title=ctx.options.getString("titre",true)
        if(!img || !title)
        {
            return await ctx.reply({ content:"Pas d'image ou de titre!",ephemeral:true})
        }
        if(img.contentType?.startsWith("image"))
        {
           if(img.size<=51000000)  //51 MO max
           {
            try{
                await ctx.deferReply()
                var id=await saveImage(img.url,img.name.split(".")[1])
                const link=VITE_BASE_URL+"/files/image/"+id;
                const embed=new EmbedBuilder().setImage(link).setColor(0x3f5427);
                await ctx.editReply({content:"Titre: "+title+"\nAuteur: "+userMention(ctx.user.id)+"\nLien: "+link,embeds:[embed]})
                
            }catch(err)
            {
                console.error(err)
                await ctx.reply( {content:"Echec de l'envoi!",ephemeral:true})
            }
                
           }
           else
            await ctx.reply( {content:"Le fichier doit faire 51Mo max!",ephemeral:true})
        }
        else
            await ctx.reply({ content:"Le fichier doit être une image!",ephemeral:true})
    },
} as Command
const uid = new ShortUniqueId({ length: 10 });
function saveImage(url:string,ext:string)
{
    if(!fs.existsSync("./uploaded/images"))
        fs.mkdirSync("./uploaded/images",{recursive:true})
    return new Promise<String>((res,err)=>{
        fetch(url).then(async im=>{
            const id=uid.rnd()
            fs.writeFileSync("./uploaded/images/"+id+"."+ext,Buffer.from(await im.arrayBuffer()))
            res(id+"."+ext);
        }).catch(err)
    })
   
    
   
    console.log()
}