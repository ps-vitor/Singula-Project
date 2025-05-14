// src/test-utils/mockResponse.ts
import { MockResponse } from './types';
import  {Response}  from  'express';

export const mockResponse = (): Response => {
  const res= {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
  } as  unknown as  Response;
  
  return res;
};