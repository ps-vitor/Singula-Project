import  {Request,Response}  from    'express';

export  const   mockResponse=()=>{
    // status:jest.fn().mockReturnThis(),
    // json:jest.fn(),
    // send:jest.fn(),
    // setHeader:jest.fn(),
    // end:jest.fn()
    const   res:Partial<Response>={};
    res.status=jest.fn().mockReturnValue(res);
    res.json=jest.fn().mockReturnValue(res);
    res.send=jest.fn().mockRejectedValue(res);
    return  res
};
