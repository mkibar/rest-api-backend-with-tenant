import mongoose, { ClientSession, FilterQuery, QueryOptions } from 'mongoose';
import roleModel, { Role } from './role.model';
import { getPagination } from '../../../utils/paginationHelper';
import AppError from '../../../utils/errors/appError';
import { deletePermissionsByRoleId, deletePermissionsByUserId } from '../permission/permission.service';

// CreateRole service
export const createRole = async (input: Partial<Role>) => {
    try {
        const roleExist = await roleNameExist(input.name as string, input.tenant!.toString());
        if (roleExist)
            throw new AppError('Role name exist', 409);

        const role = await roleModel.create(input);
        return role.toJSON();
    } catch (error: any) {
        throw error;
    }
};

// UpdateRole service
export const updateRole = async (id: string, input: Partial<Role>) => {
    try {
        const updatableRole = {
            ...input,
            //updatedDate: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        };
        return await roleModel.findByIdAndUpdate(id, updatableRole, { new: true });
    } catch (error: any) {
        throw error;
    }
};

// DeleteRole service
export const deleteRole = async (id: string) => {

    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    try {
        let role = await roleModel.findById(id);
        if (role) {
            deletePermissionsByRoleId(role?.id, role?.tenant!.toString())
            deletePermissionsByUserId(role?.id, role?.tenant!.toString())
            let result = await roleModel.deleteOne({ _id: `${id}` });

            await session.commitTransaction();
            return result;
        }
    } catch (error) {
        // Rollback any changes made in the database
        await session.abortTransaction();
        // Rethrow the error
        throw error;
    } finally {
        // Ending the session
        session.endSession();
    }
    // try {
    //     let role = await roleModel.findById(id);
    //     if (role) {
    //         deletePermissionsByRoleId(role?.id, role?.tenant!.toString())
    //         deletePermissionsByUserId(role?.id, role?.tenant!.toString())
    //         let result = await roleModel.deleteOne({ _id: `${id}` });
    //         return result;
    //     }
    // } catch (error: any) {
    //     throw error;
    // }
};

// List Roles with paging
export const queryRoles = async (tenantId: string, page: number = 1, items_per_page: number = 10, search: string | any = '', sortField: string | any = '', order: string | any = '') => {
    try {
        let sort = sortField ? JSON.parse(`{"${sortField}":"${order ?? '1'}"}`) : {};

        let filter = {
            $and: [
                { "tenant": tenantId },
                { "name": new RegExp(`${search}`, 'i') }
            ],
        }
        let data = await roleModel.find(filter)
            .sort(sort)
            .skip(items_per_page * (page - 1))    // kacinci sayfadan baslanacagi 
            .limit(items_per_page);               // kac kayit alinacagi

        let totalCount = await roleModel.countDocuments(filter).exec();

        let pagination = getPagination(page, items_per_page, totalCount)
        return {
            data,
            payload: { pagination }
        };
    } catch (error: any) {
        throw error;
    }
};

// Find Role by Id
export const findRoleById = async (id: string) => {
    return await roleModel.findById(id);
};

// Find one role by any fields
export const findRole = async (
    query: FilterQuery<Role>,
    options: QueryOptions = {}
) => {
    return await roleModel.findOne(query, {}, options);
};

// Role name and Tenant exist
export const roleNameExist = async (name: string, tenantId: string) => {
    try {
        return await roleModel.exists({ name: name, tenant: tenantId });
    } catch (error: any) {
        throw error;
    }
};