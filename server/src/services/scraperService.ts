import  axios   from    'axios'
import  *   as  cheerio from    'cheerio'

interface   YoutubeData{
    videoId:string;
    titulo:string;
    descricao:string;
    videoUrl:string|null;
    imgUrl:string|null
}

function    isYoutubeUrl(url:string):boolean{
    return  url.includes('youtube.com/watch?v=')
}

export  async   function    scrapeYoutubeData(url:  string){
    if(!isYoutubeUrl(url)){
        throw   new Error("Url invalida")
    }

    try{
        const   {data}=await    axios.get(url)
        const   $=cheerio.load(data)

        const   title=$('meta[name="title"]').attr('content')||"Sem titulo"
        const   description=$('meta[name="description"]').attr('content')||"Sem descricao"

        const   videoIdGet=new URL(url).searchParams.get('v')??'desconhecido'

        const   videoUrl=`https://www.youtube.com/embeded/${videoIdGet}`
        const   imgUrl=`https://img.youtube.com/embeded/${videoIdGet}/0.jpg`

        return{
            videoId:videoIdGet,
            titulo:title,
            descricao:description,
            videoUrl,
            imgUrl,
        }
    }catch(error:any){
        console.error('Error: ',error)
        throw   new Error("Erro")
    }
}
