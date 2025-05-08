import  express from    'express';
import  cors    from    'cors';
import  dotenv  from    'dotenv';
import  artigosRouter   from    "./routes/artigos.js";
import  aulasRouter from    "./routes/aulas.js";
import  path    from    'path';

function    main(){
    dotenv.config();

    const   app=express();
    app.use(cors());
    app.use(express.json());

    app.use("artigos",artigosRouter);
    app.use("aulas",aulasRouter);

    app.get('ping',(_req,res)=>{
        res.json({message:'pong'});
    });

    app.get("*",(_req,res)=>{
        res.sendFile(path.join(__dirname,"..","..","client","src","index.html"));
    })

    const   PORT=process.env.PORT||5000;
    app.listen(PORT,()=>{
        console.log(`Server running on port localhost:${PORT}`)
    })
}
main();
