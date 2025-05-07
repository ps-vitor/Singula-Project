import  express from    'express'

export  interface   Video{
    id:number;
    titulo:string;
    autor:string;
}

export  const   listarArtigos=(_req:Request,res:Response)=>{
    router.get('/',(req,res)=>{
        res.json([
            {id:1,titulo:"titulo",autor:"autor"},
        ])
    })
}
