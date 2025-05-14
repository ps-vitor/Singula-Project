import { jest } from '@jest/globals';
import { mockResponse } from '@/test-utils/mockResponse';

global.jest = jest;
(global as  any).mockResponse = mockResponse;