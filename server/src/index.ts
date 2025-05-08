import  express from    'express';
import  cors    from    'cors';
import  dotenv  from    'dotenv';
import  artigosRouter   from    "./routes/artigos";
import  aulasRouter from    "./routes/aulas";

function    main(){
    dotenv.config();

    const   app=express();
    app.use(cors());
    app.use(express.json());

    app.use("/api/artigos",artigosRouter);
    app.use("/api/aulas",aulasRouter);

 //   app.get('/api/ping',(_req,res)=>{
 //       res.json({message:'pong'});
 //   });

    app.get("/",(_req,res)=>{
        res.send("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    })

    const   PORT=process.env.PORT||5000;
    app.listen(PORT,()=>{
        console.log(`Server running on port localhost:${PORT}`)
    })
}
main();
