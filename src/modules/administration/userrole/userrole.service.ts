import { FilterQuery, QueryOptions } from 'mongoose';
import userRoleModel, { UserRole } from './userrole.model';
import { getPagination } from '../../../utils/paginationHelper';
import AppError from '../../../utils/errors/appError';

// CreateUserRole service
export const createUserRole = async (input: Partial<UserRole>) => {
    try {
        const userRolExist = await userRoleExist(input.user!.toString(), input.role!.toString(), input.tenant!.toString());
        if (userRolExist)
            throw new AppError('UserRole exist', 409);

        const role = await userRoleModel.create(input);
        return role.toJSON();
    } catch (error: any) {
        throw error;
    }
};

// UpdateUserRole service
export const updateUserRole = async (id: string, input: Partial<UserRole>) => {
    try {
        const updatableUserRole = {
            ...input,
            //updatedDate: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        };
        return await userRoleModel.findByIdAndUpdate(id, updatableUserRole, { new: true });
    } catch (error: any) {
        throw error;
    }
};

// DeleteUserRole service
export const deleteUserRole = async (id: string, tenantId: string) => {
    try {
        let result = await userRoleModel.deleteOne({ _id: `${id}`, "tenant": tenantId });
        return result;
    } catch (error: any) {
        throw error;
    }
};

// List UserRoles with paging
export const queryUserRoles = async (tenantId: string,
    userId: string, roleId: string,
    page: number = 1, items_per_page: number = 10,
    sortField: string | any = '', order: string | any = '') => {
    try {
        let sort = sortField ? JSON.parse(`{"${sortField}":"${order ?? '1'}"}`) : {};

        const query: FilterQuery<UserRole> = { tenant: tenantId };
        if (userId)
            query.user = userId;
        if (roleId)
            query.role = roleId;

        console.log('QUERY', query);
        let data = await userRoleModel.find(query)
            .sort(sort)
            .skip(items_per_page * (page - 1))    // kacinci sayfadan baslanacagi 
            .limit(items_per_page);               // kac kayit alinacagi

        let totalCount = await userRoleModel.countDocuments(query).exec();

        let pagination = getPagination(page, items_per_page, totalCount)
        return {
            data,
            payload: { pagination }
        };
    } catch (error: any) {
        throw error;
    }
};

// Find UserRole by Id
export const findUserRoleById = async (id: string) => {
    return await userRoleModel.findById(id);
};

// Find one role by any fields
export const findUserRole = async (
    query: FilterQuery<UserRole>,
    options: QueryOptions = {}
) => {
    return await userRoleModel.findOne(query, {}, options);
};

// User and Tenant exist
export const userRoleExist = async (userId: string, roleId: string, tenantId: string) => {
    try {
        return await userRoleModel.exists({ user: userId, role: roleId, tenant: tenantId });
    } catch (error: any) {
        throw error;
    }
};