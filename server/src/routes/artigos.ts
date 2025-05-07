import  express from    'express'

const   router=express.Router();

export  interface   Video{
    id:number;
    titulo:string;
    autor:string;
}

router.get('/',(req,res)=>{
    res.json([
        {id:1,titulo:"titulo",autor:"autor"},
    ])
})

export  default router;
