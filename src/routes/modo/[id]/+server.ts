import db from "$lib/DB";
import { text, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (req) => {
//    console.log(req.params.id);
    var ret=await new Promise<string>(r=>{
        var row:any=db.prepare('SELECT role FROM roles WHERE uuid = ?').get(req.params.id);
            if (row == undefined) {
                r("0");
            } else {
                r(row.role=="modo"?"1":"0");
            }
    });
    return text(ret,{headers:{type:"text/plain"}});
};