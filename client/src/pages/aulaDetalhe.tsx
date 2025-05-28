import { useParams } from "react-router-dom";

export default function AulaDetalhe() {
  const { id } = useParams<{ id: string }>();

  return (
    <main>
      <div style={{ margin: '20px' }}>
        <iframe 
          src={`https://www.youtube.com/embed/${id}`}
          width="800"
          height="450"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none', borderRadius: '8px' }}
        ></iframe>
      </div>
    </main>
  );
}