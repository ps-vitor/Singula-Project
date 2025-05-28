// client/src/pages/aulaDetalhe.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { VideoAula } from "../../../shared/types";

export default function AulaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoAula | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await fetch(`http://localhost:8000/api/videos/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch video');
        }
        const data = await response.json();
        setVideo(data);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <main>
      <h1>{video.titulo}</h1>
      <div>
        <iframe 
          width="560" 
          height="315" 
          src={`https://www.youtube.com/embed/${video.videoId}`}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
      <p>{video.descricao}</p>
    </main>
  );
}