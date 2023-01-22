import { NextFunction, Request, Response } from 'express';
import { findUserById } from '../modules/administration/user/user.service';
import AppError from '../utils/errors/appError';
import redisClient from '../utils/connectRedis';
import { verifyJwt } from '../utils/jwt';
import userLogger from '../utils/logger';

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(new AppError('You are not logged in', 401));
    }

    // Validate Access Token
    const decoded = verifyJwt<{ sub: string }>(access_token);

    if (!decoded) {
      return next(new AppError(`Invalid token or user doesn't exist`, 401));
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub);

    //TODO: Performans için: user.service içerisindeki signToken metodunda, redis içerisine User verisinin tamamı daha az süreli (8 saat) olarak yazılabilir
    //        önce user verisi kontrol edilir, var ise kullanılır yok ise yukarıdaki satır ile alınabilir. 

    if (!session) {
      return next(new AppError(`User session has expired`, 401));
    }

    // Check if user still exist
    //const user = await findUserById(JSON.parse(session)._id);
    const user = JSON.parse(session);

    if (!user) {
      return next(new AppError(`User with that token no longer exist`, 401));
    }

    // This is really important (Helps us know if the user is logged in from other controllers)
    // You can do: (req.user or res.locals.user)
    res.locals.user = user;

    next();
  } catch (err: any) {
    next(err);
  }
};
