import  {mockResponse}  from    "./test-utils/mockResponse";

beforeEach(()=>{
    jest.clearAllMocks();
});

global.mockRes=()=>({
    status: jest.fn().mockReturnThis(),
    json:   jest.fn()
});
