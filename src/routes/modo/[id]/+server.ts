import db from "$lib/DB";
import { text, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (req) => {
    console.log(req.params.id);
    var ret=await new Promise<string>(r=>{
        db.get('SELECT role FROM roles WHERE uuid = ?', [req.params.id], (err, row) => {
            if (err||row == undefined) {
                if(err)
                    console.error(err.message);
                r("0");
            } else {
                r(row.role=="modo"?"1":"0");
            }
        });
    });
    return text(ret,{headers:{type:"text/plain"}});
};