import  {ErrorRequestHandler}   from    "express"

export  const   erroHandler:ErroRequestHandler=(err,_req,res,_next)=>{
    console.error("Erro não tratado:",err.stack);
    res.status(500).json({
        error:err.name  ||  "Internal Server Error",
        message:err.message
    });
};
