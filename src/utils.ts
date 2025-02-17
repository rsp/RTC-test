import { RequestHandler } from 'express';

import logger from './logger.js';

const log = logger.getLogger('api');

interface ErrorResponse {
  error: string;
}

/**
 * Converts unknown error to some string, the error message if possible
 */
export const errorMessage = (error: unknown) =>
  typeof error === 'string'
    ? error
    : typeof error === 'object' && error && 'message' in error && typeof error.message === 'string'
      ? error.message
      : 'Unknown error';

/**
 * Simplified wrapper for simple async handlers with no arguments
 * Just to make this service more readable
 * In production we would want to differentiate errors
 * and hide potentially sensitive error data from clients
 */
export const handler = <T>(fn: () => Promise<T>): RequestHandler<unknown, ErrorResponse | T> => {
  return (req, res) => {
    fn()
      .then((result) => {
        log.info(`Request to ${req.url}`);
        res.json(result);
      })
      .catch((err: unknown) => {
        const error = errorMessage(err);
        log.error(`Request to ${req.url} error: ${error}`);
        res.status(500).json({ error });
      });
  };
};

export const handlerSync = <T>(fn: () => T): RequestHandler<unknown, ErrorResponse | T> => {
  return (req, res) => {
    try {
      log.info(`Request to ${req.url}`);
      res.json(fn());
    } catch (err: unknown) {
      const error = errorMessage(err);
      log.error(`Request to ${req.url} error: ${error}`);
      res.status(500).json({ error });
    }
  };
};
