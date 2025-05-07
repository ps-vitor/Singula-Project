import  axios   from    'axios'
import  *   as  cheerio from    'cheerio'

interface   YoutubeData{
    id:string;
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

        videoId=new URL(url).searchParams.get('v')??'desconhecido'
        const   videoUrl=videoId?`https://www.youtube.com/embeded/${id}`:null
        const   imgUrl=videoId?`https://img.youtube.com/embeded/${id}/0.jpg`:null

        return{
            id:videoId,
            titulo:title,
            descricao:description,
            videoUrl,
            imgUrl,

    }catch(error){
        console.error('Error: ',error)
        throw   new Error("Erro")
}
