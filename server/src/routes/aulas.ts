import  express from    'express';
import  {listarAulas}   from    '../controllers/aulasController'

const   router=express.Router()
router.get("/",listartAulas)
export  default router

