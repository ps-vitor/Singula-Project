import  winston from    'winston';
import  {Request,Response,NextFunction} from    "express";

export  const   logger=winston.createLogger({
    level:"debug",
    format:winston.format.json(),
    transports:[new winston.transports.Console()],
});

export  const   requestLogger=(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    logger.info(`[${req.method}]    ${req.url}`);
    next();
};
