import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../../../models/enums';
import { createOrganizationUnit, deleteOrganizationUnit, findOrganizationUnitById, queryOrganizationUnits, updateOrganizationUnit } from './organizationunit.service';

export const getOrganizationUnitHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = await findOrganizationUnitById(req.params.id);
        res.status(200).json({
            status: StatusCode.Success,
            data: role,
        });
    } catch (err: any) {
        next(err);
    }
};

export const insertOrganizationUnitHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { body } = req;
        body.tenant = res.locals?.user?.tenant;

        const user = await createOrganizationUnit(body);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const updateOrganizationUnitHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { body, params: { id } } = req;
        body.tenant = res.locals?.user?.tenant;

        const user = await updateOrganizationUnit(id, body);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const deleteOrganizationUnitHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { params: { id } } = req;
        // TODO: validate field

        const user = await deleteOrganizationUnit(id);
        res.status(200).json({
            status: StatusCode.Success,
            data: user
        });
    } catch (err: any) {
        next(err);
    }
};

export const getListOrganizationUnitsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let { page = 1, items_per_page = 10, search = '', sort = '', order = '' } = req.query;

        const result = await queryOrganizationUnits(res.locals?.user?.tenant, +page, +items_per_page, search, sort, order);
        res.status(200).json({
            status: StatusCode.Success,
            data: result.data,
            payload: result.payload
        });
    } catch (err: any) {
        next(err);
    }
};