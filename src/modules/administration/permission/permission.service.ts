import { FilterQuery, QueryOptions } from 'mongoose';
import permissionModel, { Permission } from './permission.model';
import { getPagination } from '../../../utils/paginationHelper';
import AppError from '../../../utils/errors/appError';

// CreatePermission service
export const createPermission = async (input: Partial<Permission>) => {
    try {
        const permExist = await permissionExist(input.code as string,
            input.user!?.toString() ?? null,
            input.role!?.toString() ?? null,
            input.tenant!.toString());
        if (permExist)
            throw new AppError('Permission exist', 409);

        const role = await permissionModel.create(input);
        return role.toJSON();
    } catch (error: any) {
        throw error;
    }
};

// UpdatePermission service
export const updatePermission = async (id: string, input: Partial<Permission>) => {
    try {
        const updatablePermission = {
            ...input,
            //updatedDate: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        };
        return await permissionModel.findByIdAndUpdate(id, updatablePermission, { new: true });
    } catch (error: any) {
        throw error;
    }
};

// DeletePermission service
export const deletePermission = async (id: string, tenantId: string) => {
    try {
        console.log('*-----', { _id: `${id}`, "tenant": tenantId });
        let result = await permissionModel.deleteOne({ _id: `${id}`, "tenant": tenantId });
        return result;
    } catch (error: any) {
        throw error;
    }
};

// List Permissions with paging
export const queryPermissions = async (tenantId: string,
    code: string,
    page: number = 1, items_per_page: number = 10,
    sortField: string | any = '', order: string | any = '') => {
    try {
        let sort = sortField ? JSON.parse(`{"${sortField}":"${order ?? '1'}"}`) : {};

        const query: FilterQuery<Permission> = { tenant: tenantId };
        if (code)
            query.code = new RegExp(`${code}`, 'i');

        let data = await permissionModel.find(query)
            .sort(sort)
            .skip(items_per_page * (page - 1))    // kacinci sayfadan baslanacagi 
            .limit(items_per_page);               // kac kayit alinacagi

        let totalCount = await permissionModel.countDocuments(query).exec();

        let pagination = getPagination(page, items_per_page, totalCount)
        return {
            data,
            payload: { pagination }
        };
    } catch (error: any) {
        throw error;
    }
};

// Find Permission by Id
export const findPermissionById = async (id: string) => {
    return await permissionModel.findById(id);
};

// Find one role by any fields
export const findPermission = async (
    query: FilterQuery<Permission>,
    options: QueryOptions = {}
) => {
    return await permissionModel.findOne(query, {}, options);
};

// User and Tenant exist
export const permissionExist = async (code: string, userId: string, roleId: string, tenantId: string) => {
    try {
        let filter: FilterQuery<Permission> = { code: code, tenant: tenantId };
        if (userId)
            filter.user = userId;
        if (roleId)
            filter.role = roleId;

        return await permissionModel.exists(filter);
    } catch (error: any) {
        throw error;
    }
};