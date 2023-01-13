import { NextFunction, Request, Response } from 'express';
import { partial } from 'lodash';
import { StatusCode } from '../../../models/enums';
import { createUser, deleteUser, findUserById, queryUsers, updateUser } from './user.service';

export const getUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(req.params.id);
    res.status(200).json({
      status: StatusCode.Success,
      data: user,
    });
  } catch (err: any) {
    next(err);
  }
};

export const insertUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body } = req;
    // TODO: email/or username exist
    // validate other fields
    body.password = 'demodemo';

    const user = await createUser(body);
    res.status(200).json({
      status: StatusCode.Success,
      data: user
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body, params: { userId } } = req;
    // TODO: email/or username exist
    // validate other fields

    const user = await updateUser(userId, body);
    res.status(200).json({
      status: StatusCode.Success,
      data: user
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { params: { userId } } = req;
    // TODO: validate field

    const user = await deleteUser(userId);
    res.status(200).json({
      status: StatusCode.Success,
      data: user
    });
  } catch (err: any) {
    next(err);
  }
};

export const getMeHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    res.status(200).json({
      status: StatusCode.Success,
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { page = 1, items_per_page = 10, search = '', sort = '', order = '' } = req.query;

    const result = await queryUsers(+page, +items_per_page, search, sort, order);
    res.status(200).json({
      status: StatusCode.Success,
      data: result.data,
      payload: result.payload
    });
  } catch (err: any) {
    next(err);
  }
};