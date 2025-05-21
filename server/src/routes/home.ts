// ./server/src/route/aulas.ts

import { Router } from "../../deps.ts";
// import  {Context}   from    "../../deps.ts"

const   router=new  Router();

router.get("/", (ctx) => {
  ctx.response.body = { 
    message: "Bem-vindo à API Singula",
    endpoints: {
      aulas: "/aulas",
    }
  };
});

export default router;