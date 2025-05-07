import  styles  from  '../styles/Aulas.module.css';
import VideoCard from '../components/VideoCard';
import singulaLogo from '/images/singula.jpg';
import  React,{useState,UseEffect}  from    'react';

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

    useEffect(()=>{
        const   fetchAulas=async()=>{
            setLoading(true);
            setError(null);
            
            try{
                const   response=await  fetch('/aulas');
                if(!response.ok){
                    throw   new Error('Erro ao buscar aulas');
                }
                const   data:   Aula[]=await    response.json();
                setAulas(data);
            }catch(error:any){
                setError(error.message);
            }finally{
                setLoading(false);
            }
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
                     {videos.map((aula)=>(
                        <VideoCard
                            key={aula.id}
                            id={aula.id}
                            title={aula.title}
                            videoId={aula.videoId}
                        />
                     ))}
                </div>
            </div>
        </main>
    );
}
