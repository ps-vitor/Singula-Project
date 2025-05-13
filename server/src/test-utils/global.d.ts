import  {Response}  from    'express';

declare global{
    namespace   NodeJS{
        interface   Global{
            mockRes:()=>Partial<Response>;
        }
    }
}