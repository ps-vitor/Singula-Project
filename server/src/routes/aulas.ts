// ./server/src/route/listarAulas.ts

import { Router } from "../../deps.ts";
import { listarAulas } from "../controllers/aulasController.ts"; // .ts explícito
// import { Context } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router.get("/",async(ctx:any)=>{
    await   listarAulas(ctx);
})

export default router;