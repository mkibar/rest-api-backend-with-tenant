import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../../../models/enums';
import { createRole, deleteRole, findRoleById, queryRoles, roleNameExist, updateRole } from './role.service';

export const getRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = await findRoleById(req.params.id);
        res.status(200).json({
            status: StatusCode.Success,
            data: role,
        });
    } catch (err: any) {
        next(err);
    }
};

export const insertRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { body } = req;
        body.tenant = res.locals?.user?.tenant;

        const user = await createRole(body);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const updateRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { body, params: { roleId } } = req;
        body.tenant = res.locals?.user?.tenant;

        const user = await updateRole(roleId, body);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const deleteRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { params: { roleId } } = req;
        // TODO: validate field

        const user = await deleteRole(roleId);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const getListRolesHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let { page = 1, items_per_page = 10, search = '', sort = '', order = '' } = req.query;

        const result = await queryRoles(res.locals?.user?.tenant,+page, +items_per_page, search, sort, order);
        res.status(200).json({
            status: StatusCode.Success,
            data: result.data,
            payload: result.payload
        });
    } catch (err: any) {
        next(err);
    }
};