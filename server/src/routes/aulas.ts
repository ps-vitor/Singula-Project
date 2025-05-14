// ./server/src/route/listarAulas.ts

import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { listarAulas } from "../controllers/aulasController.ts"; // .ts explícito

const router = new Router();
router.get("/", listarAulas);

export default router;