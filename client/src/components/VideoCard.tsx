// ./client/src/components/VideoCard.tsx

import { Link } from 'react-router-dom';
import styles from '../styles/Aulas.module.css';

interface VideoCardProps {
  id: string; // Alterado para string para consistência
  title: string;
  videoId: string;
}

export default function VideoCard({ id, videoId, title }: VideoCardProps) {
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  
  return (
    <Link to={`/aulas/${id}`} className={styles.videoCard}>
      <img 
        src={thumbnailUrl} 
        alt={`Thumbnail de ${title}`} 
        className={styles.thumbnail}
        loading="lazy"
      />
      <h4>{title}</h4>
    </Link>
  );
}