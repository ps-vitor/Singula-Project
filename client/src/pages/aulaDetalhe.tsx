import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import type { VideoAula } from "../../../shared/types";
import  styles  from  "../styles/AulaDetalhe.module.css";

export default function AulaDetalhe() {
    const { id } = useParams<{ id: string }>();
    const [videoAula, setVideoAula] = useState<VideoAula | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const response = await fetch('http://localhost:8000/aulas');
                const { data } = await response.json();
                const aula = data.find((v: VideoAula) => v.id === id || v.videoId === id);
                setVideoAula(aula || null);
            } catch (err) {
                console.error('Erro ao buscar vídeos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();
    }, [id]);

    if (loading) return <div>Carregando...</div>;
    if (!videoAula) return <div>Vídeo não encontrado</div>;

    return (
        <main className={styles.titulo}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ 
                    fontSize: '24px',
                    fontWeight: 'bold',
                    margin: '10px 0'
                }}>
                    {videoAula.titulo}
                </h1>
            </div>

            <div className={styles.aula}>
                <iframe 
                  src={`https://www.youtube.com/embed/${id}`}
                  width="800"
                  height="450"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 'none', borderRadius: '8px' }}
                ></iframe>
            </div>

            {/* Rodapé */}
            <div className={styles.descricao}>
              <p>
                {videoAula.descricao}
              </p>
            </div>
        </main>
    );
}