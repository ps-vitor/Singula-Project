// ./server/src/middleware/errorHandler.ts

import { Context } from "../../deps.ts";

export async function errorHandler(context: Context, next: () => Promise<unknown>) {
    try {
        await next();
    } catch (err) {
        console.error(err);
        context.response.status = 500;
        context.response.body = { 
            code: "INTERNAL_ERROR",
            message: "Ocorreu um erro interno"
        };
    }
}