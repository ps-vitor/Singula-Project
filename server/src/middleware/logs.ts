import  {Request,Response,NextFunction} from    "express";

export  const   requestLogger=(req:Request,_res:Response,next:NextFunction)=>{
    console.log(`[${new Date().ToISOString()}] ${req.method} ${req.path});
    next();
};
