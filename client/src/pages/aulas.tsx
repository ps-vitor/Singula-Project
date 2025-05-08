import  styles  from  '../styles/Aulas.module.css';
import VideoCard from '../components/VideoCard';
import  {useState,useEffect}  from    'react';
import  YoutubeData   from    '../../../server/src/services/scraperService';

interface   Aula{
    id:number;
    titulo:string;
    videoId:string;
    descricao?:string;
    videoUrl?:string|null;
    imgUrl?:string|null;
}

export  default function    Aulas(){
    const[aulas,setAulas]=useState<Aula[]>([]);
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState<string|null>(null);
    const[videos,setVideos]=useState<YoutubeData[]>([]);

    useEffect(()=>{
        const   fetchAulas=async()=>{
            setLoading(true);
            setError(null);
            
            // try{
                // const   resVideos=await fetch()
            // }catch(error:any){
                // setError(error.message);
            // }finally{
                // setLoading(false);
            // }
        };
        fetchAulas();
    },[]);

    if(loading){
        return  <div>Carregando aulas...</div>;
    }
    if(error){
        return  <div>Erro: {error}</div>;
    }

    return(
        <main>
            <div>
                <h2>Aulas</h2>
                <div className={styles.aulas}>
                     {videos.map((aula:YoutubeData)=>(
                        <VideoCard
                            key={aula.videoId}
                            id={aula.videoId}
                            title={aula.titulo}
                            videoId={aula.videoId}
                        />
                     ))}
                </div>
            </div>
        </main>
    );
}
