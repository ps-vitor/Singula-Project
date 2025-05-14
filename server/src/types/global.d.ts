import { Response } from 'express';
import { mockResponse } from '@/test-utils/mockResponse';

declare global {
  namespace NodeJS {
    interface Global {
      mockResponse: typeof mockResponse;
    }
  }
}