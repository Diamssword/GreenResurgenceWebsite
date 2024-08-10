import type { RequestHandler } from './$types';
import fs from "fs";
export const GET: RequestHandler = async (ctx) => {
    const f: string = ctx.params.file;
    const ext = f.split(".")[1];
    if (ext) {
        if (fs.existsSync('./uploaded/images/' + f)) {
            try {
                const img = fs.readFileSync('./uploaded/images/' + f)
                return new Response(img,{
                    status: 200,
                    headers: {
                        "Content-type": "image/" + ext,
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