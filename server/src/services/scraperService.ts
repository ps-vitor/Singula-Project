import  axios   from    'axios'
import  *   as  cheerio from    'cheerio'

export  default interface   YoutubeData{
    videoId:string;
    titulo:string;
    descricao:string;
    videoUrl:string|null;
    imgUrl:string|null
}

export  async   function    scrapeChannelVideos(channelUrl:  string):Promise<YoutubeData[]>{
    try{
        const{data:html}=await   axios.get(channelUrl);
        const   $=cheerio.load(html);
        const   videoIds=new    Set<string>();

        // $("img").each((_i,el)=>{
            // const   src=$(el).attr("src");
            // if(!src)return;
            // const   match=src?.match(/vi\/([a-zA-z0-9_-]{11})\//);
            // if(match&&match[1]){
                // videoIds.add(match[1]);
            // }
        // });

        const   videos:YoutubeData[]=[];

        for(const   id  of  videoIds){
            try{
                const   url=`https://www.youtube.com/watch?v=${id}`;
                const   videoUrl=`http://www.youtube.com/embed/${id}`;
                const   imgUrl=`https://img.youtube.com/vi/${id}/0.jpg`;
                const   {data:videoHtml}=await   axios.get(url);
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
        }
        return  videos;
    }catch(err){
        console.error("Erro ao raspar canal:",err);
        throw   new Error("Erro ao raspar canal.");
    }
}
