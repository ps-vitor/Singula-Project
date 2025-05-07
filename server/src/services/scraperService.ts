import  axios   from    'axios'
import  *   as  cheerio from    'cheerio'

export  async   function    scrapeYoutubeData(url:  string){
    try{
        const   {data}=await    axios.get(url)
        const   $=cheerio.load(data)

        const   title=$('meta[name="title"]').attr('content')||"Sem titulo"
        const   description=$('meta[name="description"]').attr('content')||"Sem descricao"

        const   id=new  URL(url).searchParams.get('v')??'desconhecido'

        return{
            id,
            titulo:title,
            descricao:description,
            videoUrl:`https://www.youtube.com/embeded/${id}`,
            imgUrl:`https://img.youtube.com/embeded/${id}/0.jpg`

    }catch(error){
        console.error('Error: ',error)
        throw   new Error("Erro")
}
