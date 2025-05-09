import  {Router} from    'express';
import  {listarAulas}   from    '../controllers/aulasController'

const   router=Router();
router.get("/",(req,res)=>{
    res.json({msg:"rota de aulas"});
});
export  default router;

