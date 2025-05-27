// ./client/src/pages/aulaDetalhe.tsx

import { useParams } from "react-router-dom";
// import videos from "../data/videos";

export  default function    AulaDetalhe(){
    const   {id}=useParams<{id:string}>();
    const   video=videos.find((v)=>v.id===Number(id))

    if(!video)return    <p>Vídeo não encontrado.</p>

    return(
        <main>
            <h1>{video.title}</h1>
            <iframe 
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={video.title}
                width="640"
                height="360"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
            <p>{video.description}</p>
        </main>
    )
}