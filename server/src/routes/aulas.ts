import  express from    'express';
import  {listarAulas}   from    '../controllers/aulasController'

const   router=express.Router()
router.get("/",listarAulas)
export  default router

