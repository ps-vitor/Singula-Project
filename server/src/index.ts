import  express from    'express';
import  cors    from    'cors';
import  dotenv  from    'dotenv';

function    main(){
    dotenv.config();

    const   app=express();
    app.use(cors());
    app.use(express.json());

    app.get('/api/ping',(_req,res)=>{
        res.json({message:'pong'});
    });

    const   PORT=process.env.PORT||5000;
    app.listen(PORT,()=>{
        console.log(`Server running on port localhost:${PORT}`)
    })
}