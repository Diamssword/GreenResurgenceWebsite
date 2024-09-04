import type { RequestHandler } from './$types';
import fs from "fs";
export const GET: RequestHandler = async (ctx) => {
    const f: string = ctx.params.file;
    const ext = f.split(".")[1];
    if (ext=="json"|| ext=="png") {
        if (fs.existsSync('./uploaded/skins/' + f)) {
            try {
                const img = fs.readFileSync('./uploaded/skins/' + f)
                
                return new Response(img,{
                    status: 200,
                    headers: {
                        "Content-type": ext=="json"?"text/json":"image/png",
                        "Content-Disposition": "inline; filename=" + f
                    }
                })
            } catch (err) {
                return new Response(JSON.stringify(err),{status:500})
            }
        }
    }
    return new Response("File not found",{status:404});
};