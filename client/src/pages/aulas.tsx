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
        const response = await fetch('http://localhost:8000/api/aulas');
        if (!response.ok) {
          throw new Error('Erro ao carregar aulas');
        }
        const data = await response.json();
        setVideos(data.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
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