import  express from    'express';
import  cors    from    'cors';
import  dotenv  from    'dotenv';
import  aulasRouter from    "@/routes/aulas";
import { fileURLToPath } from 'url';
import  path  from  "path";
import  {requestLogger} from    '@/middleware/logger';
import  {errorHandler}  from    "@/middleware/errorHandler";
// import { patch } from 'axios';
// import { configure } from 'winston';

const getDirname=()=>{
  if(typeof import.meta?.url!=='undefined'){
    return  path.dirname(new  URL(import.meta.url).pathname);
  }
  return  process.cwd();
}

const currentDir=getDirname();

export  const app=express();

export  function    configureApp(){
    dotenv.config();
    app.use(cors());
    app.use(express.json());
    app.use(requestLogger);
    // app.use("/artigos", artigosRouter);
    app.use("/aulas", aulasRouter);

    app.all("*",(_req,res)=>{
      res.sendFile(path.resolve(currentDir, '../../client/src/index.html'))
    });

    app.use(errorHandler);
}

function  startServer(){
  const   PORT=process.env.PORT||5000;
  app.listen(PORT,()=>{
      console.log(`Server running on port localhost:${PORT}`)
  });
}

if (process.env.NODE_ENV !== 'test') {
  (async()=>{
    await configureApp();
    startServer;
  })()
}

// export  default{
  // configureApp,
  // app
// };
