// shared/types.ts
export interface VideoAula {
  id: string;
  videoId: string;
  titulo: string;
  descricao: string;
  videoUrl: string;
  imgUrl: string;
}

export  interface ContentTypeMap{
  [key:string]:string;
}

export const staticFileContentTypes: ContentTypeMap = {
    'html': 'text/html',
    'js': 'application/javascript',
    'css': 'text/css',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'txt': 'text/plain'
};

export interface VideoAula {
  id: string;
  titulo: string;
  descricao: string;
  url: string;          // substitui videoUrl
  thumbnail: string;    // substitui imgUrl
  duracao?: string;
  publicadoEm?: string;
}