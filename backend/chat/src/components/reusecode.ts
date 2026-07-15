import type { NextFunction, Request, Response } from "express";

type RequestHandler<Req extends Request = Request> = (
  req: Req,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export const TryCatch = <Req extends Request = Request>(func: RequestHandler<Req>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await func(req as Req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
