import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../../../models/enums';
import { createTenant, deleteTenant, findTenantById, queryTenants, updateTenant } from './tenant.service';

export const getTenantHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tenant = await findTenantById(req.params.id);
        res.status(200).json({
            status: StatusCode.Success,
            data: tenant,
        });
    } catch (err: any) {
        next(err);
    }
};

export const insertTenantHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { body } = req;
        // TODO: validate name exist

        const user = await createTenant(body);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const updateTenantHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { body, params: { tenantId } } = req;
        // TODO: name exist

        const user = await updateTenant(tenantId, body);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const deleteTenantHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { params: { tenantId } } = req;
        // TODO: validate field

        const user = await deleteTenant(tenantId);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const getListTenantsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let { page = 1, items_per_page = 10, search = '', sort = '', order = '' } = req.query;

        const result = await queryTenants(+page, +items_per_page, search, sort, order);
        res.status(200).json({
            status: StatusCode.Success,
            data: result.data,
            payload: result.payload
        });
    } catch (err: any) {
        next(err);
    }
};