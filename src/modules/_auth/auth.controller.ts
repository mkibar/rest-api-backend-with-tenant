import config from 'config';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { StatusCode } from '../../models/enums';
import { CreateUserInput, LoginUserInput } from '../administration/user/user.schema';
import { createUser, findUser, signToken } from '../administration/user/user.service';
import AppError from '../../utils/errors/appError';
import redisClient from '../../utils/connectRedis';
import tenantModel, { Tenant } from '../administration/tenant/tenant.model';

// Exclude this fields from the response
export const excludedFields = ['password'];

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

// Delete cookie options
const deleteCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now()
  ),
  httpOnly: true,
  sameSite: 'lax',
};

// Only set secure to true in production
if (process.env.NODE_ENV === 'production')
  accessTokenCookieOptions.secure = true;

export const registerHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenant = await tenantModel.findById(req.body.tenant).lean();
    if (!tenant)
      throw new AppError('Tenant bulunamadı!', 500);

    const user = await createUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      tenant: tenant._id
    });

    res.status(201).json({
      status: StatusCode.Success,
      data: {
        user,
      },
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: StatusCode.Fail,
        message: 'Email already exist',
      });
    }
    next(err);
  }
};

export const loginHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from the collection
    const user = await findUser({ email: req.body.email });

    // Check if user exist and password is correct
    if (
      !user ||
      !(await user.comparePasswords(user.password, req.body.password))
    ) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Create an Access Token
    const { access_token } = await signToken(user);

    // Send Access Token in Cookie
    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send Access Token
    res.status(200).json({
      status: 'success',
      api_token: access_token
    });
  } catch (err: any) {
    next(err);
  }
};

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from the collection
    const user = res.locals.user;

    // Delete Session in Redis
    redisClient.del(user._id.toString());

    // Send Access Token in Cookie
    res.cookie('access_token', null, deleteCookieOptions);
    res.cookie('logged_in', false, deleteCookieOptions);

    // Send Access Token
    res.status(200).json({
      status: 'success',
    });
  } catch (err: any) {
    next(err);
  }
};

