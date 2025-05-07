import  {Request,Response}  from    'express'

interface   VideoCardProps{
    id:number;
    title:string;
    videoId:string;
}

export  const   listarAulas=(_req:Request,res:Response)=>{
    router.get("/",(_req,res_=>{
        res.json([
            {id:1,titulo:"",videoId:""}
        ])
    })
}
