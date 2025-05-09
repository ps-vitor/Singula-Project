import  {Request,Response}  from    'express';
import  {scrapeChannelVideos} from    '../services/scraperService';
import  YoutubeData  from '../services/scraperService';

export  const   listarAulas=async(_req:Request,res:Response)=>{
    try{
        const   url="https://www.youtube.com/@Pr.Singula"; 
        const   aulas=await scrapeChannelVideos(url);

        const   lista=aulas.map((aula:YoutubeData,index:number)=>({
            id:index+1,
            ...aula
        }))

        res.json(lista);
    }catch(error){
        console.error(`Erro ao buscar aulas: `,error);
        res.status(500).json({
            code:"YT_SCRAPE_FAILED",
            mensagem:"Erro ao buscar aulas"
        });
    }
};
