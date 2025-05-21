// ./server/src/routes/aulas.ts

import { Router } from "../../deps.ts";
import { listarAulas } from "../controllers/aulasController.ts"; // .ts explícito
import  {Context}   from    "../../deps.ts"

const router=new  Router();

router.get("/aulas",async(ctx:Context)=>{
    await   listarAulas(ctx);
})

router.get("/aulas",async(ctx:Context)=>{
    ctx.response.status=200;
    ctx.response.body={
        message:"Lista de aulas",
        timeStamp:new   Date().toISOString(),
    };
    await   listarAulas(ctx);
})

export default router;