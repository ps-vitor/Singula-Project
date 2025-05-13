import  {mockResponse}  from "./test-utils/mockResponse";
import  {Response}  from    'express';

beforeEach(()=>{
    jest.clearAllMocks();
});

(global as  any).mockRes=():Partial<Response>=>({
    status:jest.fn().mockReturnThis(),
    json:jest.fn(),
    send:jest.fn()
});