import  axios, { AxiosError }   from    'axios'
import  *   as  cheerio from    'cheerio'
import {logger}   from    '@/middleware/logger'

export  interface   YoutubeData{
    videoId:string;
    titulo:string;
    descricao:string;
    videoUrl:string|null;
    imgUrl:string|null
}

export  async   function    scrapeChannelVideos(channelUrl:  string):Promise<YoutubeData[]>{
    if(!channelUrl.includes("youtube.com")||!channelUrl.startsWith("http")){
        throw   new Error("URL_INVALIDA");
    };
    try{
        const{data:html}=await   axios.get(channelUrl,{
            timeout:1000,
            headers:{
                "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
            }
        });
        const   $=cheerio.load(html);
        const   videoIds=new    Set<string>();

        $('a[hreaf*="/watch?v="').each((_i,el)=>{
            const   href=$(el).attr("href");
            const   match=href?.match(/vi=([a-zA-z0-9_-]{11})/);
            if(match?.[1]){
                videoIds.add(match[1]);
            }
        });

        const   videos:YoutubeData[]=[];

        await   Promise.all(Array.from(videoIds).map(async(id)=>{
            try{
                const   url=`https://www.youtube.com/watch?v=${id}`;
                const   videoUrl=`http://www.youtube.com/embed/${id}`;
                const   imgUrl=`https://img.youtube.com/vi/${id}/0.jpg`;
                const { data: videoHtml } = await axios.get(`https://www.youtube.com/watch?v=${id}`, {
                    timeout: 5000
                });
                const   $$=cheerio.load(videoHtml);
                const   title=$$('meta[name="title"]').attr("content")||"Sem titulo";
                const   description=$$('meta[name="description"]').attr("content")||"Sem descricao";

                videos.push({videoId:id,
                            titulo:title,
                            descricao:description,
                            videoUrl,
                            imgUrl
                });
            }catch(err){
                console.warn(`Erro ao obter dados do video ${id}`);
            }
        }));
        return  videos;
    }catch(err){
        if(err  instanceof  AxiosError){
            logger.error("Falha na requisilção HTTP",{
                url:channelUrl,
                code:err.code,
                message:err.message
            })
        }else{
            logger.error("Erro desconhecido",{err});
        }
        throw   new Error("SCRAPE_FAILED");
    }
}

