import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../../../models/enums';
import AppError from '../../../utils/errors/appError';
import { createPermission, deletePermission, findPermissionById, queryPermissions, updatePermission } from './permission.service';

// find permission by Id
export const getPermissionHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = await findPermissionById(req.params.id);
        res.status(200).json({
            status: StatusCode.Success,
            data: role,
        });
    } catch (err: any) {
        next(err);
    }
};

export const insertPermissionHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { body } = req;
        body.tenant = res.locals?.user?.tenant;

        if (!body.user && !body.role)
            return next(new AppError('At least one of the User or Role information must be filled', 401));

        const user = await createPermission(body);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const updatePermissionHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { body, params: { permissionId } } = req;
        body.tenant = res.locals?.user?.tenant;

        const permission = await updatePermission(permissionId, body);
        res.status(200).json({
            status: StatusCode.Success,
            data: permission
        });
    } catch (err: any) {
        next(err);
    }
};

export const deletePermissionHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { params: { permissionId } } = req;
        // TODO: validate field

        const user = await deletePermission(permissionId, res.locals?.user?.tenant);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const getListPermissionsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let { search = '',
            page = 1, items_per_page = 10, sort = '', order = '' } = req.query;

        const result = await queryPermissions(res.locals?.user?.tenant,
            search as string,
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