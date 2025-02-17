/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { setTimeout as sleep } from 'timers/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { errorMessage, handler } from '../src/utils.js';

describe('utils', () => {
  describe('errorMessage', () => {
    it('should handle string', () => {
      const message = 'test string';
      const result = errorMessage(message);
      expect(result).toBe(message);
    });

    it('should handle Error with message', () => {
      const message = 'test error message';
      const error = new Error(message);
      const result = errorMessage(error);
      expect(result).toBe(message);
    });

    it('should return default message for unknown error', () => {
      const error = { unknown: '...' };
      const result = errorMessage(error);
      expect(result.toLowerCase()).toContain('error');
    });
  });

  describe('handler', () => {
    const delay = 100;
    const jsonMock = vi.fn() as any;
    const statusMock = vi.fn().mockReturnThis() as any;
    const nextMock = vi.fn() as any;
    const reqMock = {} as any;
    const resMock = {
      json: jsonMock,
      status: statusMock,
    } as any;

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should handle success', async () => {
      handler(async () => {
        return Promise.resolve({ success: '...' });
      })(reqMock, resMock, nextMock);
      await sleep(delay);
      expect(jsonMock).toHaveBeenCalledOnce();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should handle error', async () => {
      const message = 'error message';
      handler(async () => {
        return Promise.reject(new Error(message));
      })(reqMock, resMock, nextMock);
      await sleep(delay);
      expect(jsonMock).toHaveBeenCalledOnce();
      expect(statusMock).toHaveBeenCalledOnce();
      expect(statusMock).toHaveBeenCalledWith(500);
    });
  });
});
