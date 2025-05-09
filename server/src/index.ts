import  express from    'express';
import  cors    from    'cors';
import  dotenv  from    'dotenv';
import  path    from    'path';
// import  artigosRouter   from    "./routes/artigos";
import  aulasRouter from    "./routes/aulas";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function    main(){
    dotenv.config();

    const   app=express();
    app.use(cors());
    app.use(express.json());

    // app.use("/artigos", artigosRouter);
    app.use("/aulas", aulasRouter);
    
    // Por último, catch-all
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, '..', '..', 'client', 'src', 'index.html'));
    });

    const   PORT=process.env.PORT||5000;
    app.listen(PORT,()=>{
        console.log(`Server running on port localhost:${PORT}`)
    })

    app.use((err:Error,req:Request,res:Response,_next:NextFunction)=>{
        console.error("Erro não tratado:", err.stack);
        res.status(500).json({
            error:"Internal Server Error",
            message:err.message ||  "Ocorreu um erro inesperado."
        });
    });
}
main();
