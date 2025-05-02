import  styles  from  '../styles/Aulas.module.css'
import  videos  from    '../data/videos'
import VideoCard from '../components/VideoCard';
import singulaLogo from '/images/singula.jpg'

export  default function    Aulas(){
    return(
        <main>
            <div>
                <h2>Aulas</h2>
                <div className={styles.aulas}>
                     {videos.map((video)=>(
                        <VideoCard
                            key={video.id}
                            id={video.id}
                            title={video.title}
                            videoId={video.videoId}
                        />
                     ))}
                </div>
            </div>
        </main>
    );
}
