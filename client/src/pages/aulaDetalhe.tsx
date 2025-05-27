// ./client/src/pages/aulaDetalhe.tsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { VideoAula } from "../../../shared/types";
import { YouTubeScraperService } from "../../../server/src/services/YoutubeScraperService";
import styles from "../styles/AulaDetalhe.module.css";

export default function AulaDetalhe() {
    const { id } = useParams<{ id: string }>();
    const [video, setVideo] = useState<VideoAula | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ytscrap = new YouTubeScraperService();
        
        const fetchVideoData = async () => {
            try {
                setLoading(true);
                if (!id) throw new Error("ID do vídeo não fornecido");

                const videoData = await ytscrap.getVideoDetails(id);
                if (!videoData) throw new Error("Vídeo não encontrado");
                setVideo(videoData);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        };
        
        fetchVideoData();
    }, [id]);

    if (loading) return <p>Carregando vídeo...</p>;
    if (error) return <p>Erro: {error}</p>;
    if (!video) return <p>Vídeo não encontrado</p>;

    return (
        <main className={styles.videoWrapper}>
            <div className={styles.videoContainer}>
                <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.titulo}
                    allowFullScreen
                    className={styles.videoIframe}
                />
            </div>

            <div className={styles.metaData}>
                <div className={styles.channelInfo}>
                    {video.canal && (
                        <span className={styles.channel}>
                            Canal: {video.canal}
                        </span>
                    )}
                    {video.duracao && (
                        <span className={styles.duracao}>
                            {video.duracao}
                        </span>
                    )}
                </div>
            </div>
        </main>
    );
}