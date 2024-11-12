import { text, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (req) => {
    console.log(req.params.id)
    console.log("requested");
    return text("1");
};