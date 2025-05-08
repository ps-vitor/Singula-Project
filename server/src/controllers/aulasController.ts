import  {Request,Response}  from    'express'
import  {scrapeYoutubeData} from    '../services/scraperService'

interface   Aula{
    id:number;
    titulo:string;
    videoId:string; descricao?:string; 
    videoUrl?:string|null;
    imgUrl?:string|null;
}

export  const   listarAulas=async(_req:Request,res:Response)=>{
    try{
        const   urls=[
            "https://www.youtube.com/@Pr.Singula"
        ]

        const   aulas:Aula[]=[]

        for(const   url of  urls){
            try{
                const   data=await  scrapeYoutubeData(url)
                aulas.push({
                    id:aulas.length+1,
                    titulo:data.titulo,
                    videoId:data.videoId,
                    descricao:data.descricao,
                    videoUrl:data.videoUrl,
                    imgUrl:data.imgUrl,
                })
            }catch(error){
                console.error(`Erro ao raspar ${url}: `,error)
            }
        }
        res.json(aulas)

    }catch(error){
        console.error(`Erro ao buscar aulas: `,error)
        res.status(500).json({mensagem:"Erro ao buscar aulas"});
    }
}
