import  express from    'express';
import  cors    from    'cors';
import  dotenv  from    'dotenv';
import  path    from    'path';
import  aulasRouter from    "./routes/aulas";
import { fileURLToPath } from 'url';
import  {requestLogger} from    './middleware/logger';
import  {errorHandler}  from    "./middleware/errorHandler";
// import { configure } from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export  const app=express();

export  function    configureApp(){
    dotenv.config();

    app.use(cors());
    app.use(express.json());
    app.use(requestLogger);

    // app.use("/artigos", artigosRouter);
    app.use("/aulas", aulasRouter);
    
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, '..', '..', 'client', 'src', 'index.html'));
    });

    app.use(errorHandler);
}

function  startServer(){
  const   PORT=process.env.PORT||5000;
  app.listen(PORT,()=>{
      console.log(`Server running on port localhost:${PORT}`)
  });
}
if(import.meta.url===`file://${process.argv[1]}`){
  configureApp();
  startServer();
}

// export  default{
  // configureApp,
  // app
// };
