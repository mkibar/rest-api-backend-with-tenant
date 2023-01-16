import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../../../models/enums';
import { createUserRole, deleteUserRole, findUserRoleById, queryUserRoles, updateUserRole } from './userrole.service';

export const getUserRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = await findUserRoleById(req.params.id);
        res.status(200).json({
            status: StatusCode.Success,
            data: role,
        });
    } catch (err: any) {
        next(err);
    }
};

export const insertUserRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { body } = req;
        body.tenant = res.locals?.user?.tenant;

        const user = await createUserRole(body);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const updateUserRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { body, params: { userRoleId } } = req;
        body.tenant = res.locals?.user?.tenant;

        const user = await updateUserRole(userRoleId, body);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const deleteUserRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { params: { userRoleId } } = req;
        // TODO: validate field

        const user = await deleteUserRole(userRoleId,  res.locals?.user?.tenant);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const getListUserRolesHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let { userId = '', roleId = '',
            page = 1, items_per_page = 10, sort = '', order = '' } = req.query;

        const result = await queryUserRoles(res.locals?.user?.tenant, userId as string, roleId as string,
            +page, +items_per_page, sort = sort, order = order);
        res.status(200).json({
            status: StatusCode.Success,
            data: result.data,
            payload: result.payload
        });
    } catch (err: any) {
        next(err);
    }
};