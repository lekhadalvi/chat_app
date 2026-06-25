import type { NextFunction, Request, Response } from "express";

type RequestHandler = (req:Request ,res :Response,next:NextFunction) =>Promise<unknown>

export const TryCatch = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

