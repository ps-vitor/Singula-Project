// ./client/src/components/VideoCard.tsx

import  {Link}    from    'react-router-dom'
import  styles  from    '../styles/Aulas.module.css'

interface   VideoCardProps{
    id:number;
    title:string;
    videoId:string;
}

export  default function    VideoCard({id,videoId,title}:VideoCardProps){
    const   thumbnailUrl=`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    
    return(
        <Link to={`/aulas/${id}`}className={styles.videoCard}>
            <img src={thumbnailUrl} alt={`Thumbnail de ${title}`} className={styles.thumbnail}/>
            <h4>{title}</h4>
            {/* <p>Clique para assistir</p> */}
        </Link>
    )
}