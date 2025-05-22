// ./client/src/pages/aulas.tsx
import styles from '../styles/Aulas.module.css';
import VideoCard from '../components/VideoCard';
import { useState, useEffect } from 'react';
import { VideoAula } from '../../../shared/types';

export default function Aulas() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoAula[]>([]);

  useEffect(() => {
    const fetchAulas = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Iniciando requisição...")
        const response = await fetch('http://localhost:8000/aulas');
        console.log("Resposta recebida:",response);

        if (!response.ok) {
          const errorText=await response.text();
          console.error("Erro na resposta:",errorText);
          throw new Error('Erro ao carregar aulas');
        }
        
        const data = await response.json();
        console.log("Dados recebidos:",data);
        if(!data.success)throw  new Error(data.error);
        setVideos(data.data||data);
      } catch (error: any) {
        console.log("Erro na requisição:",error);
        setError(error  instanceof  Error?error.message:String(error));
      } finally {
        setLoading(false);
        console.log("Requisição finalizada");
      }
    };
    fetchAulas();
  }, []);

  if (loading) {
    return <div>Carregando aulas...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <main>
      <div>
        <h2>Aulas</h2>
        <div className={styles.aulas}>
          {videos.map((aula) => (
            <VideoCard
              key={aula.videoId}
              id={aula.id}
              title={aula.titulo}
              videoId={aula.videoId}
            />
          ))}
        </div>
      </div>
    </main>
  );
}