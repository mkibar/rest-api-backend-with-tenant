import { FilterQuery, QueryOptions } from 'mongoose';
import tenantModel, { Tenant } from './tenant.model';
import { getPagination } from '../../../utils/paginationHelper';

// CreateTenant service
export const createTenant = async (input: Partial<Tenant>) => {
    try {
        const tenant = await tenantModel.create(input);
        return tenant.toJSON();
    } catch (error: any) {
        throw error;
    }
};

// UpdateTenant service
export const updateTenant = async (id: string, input: Partial<Tenant>) => {
    try {
        const tenant = await findTenantById(id);
        const updatableTenant = {
            ...tenant,
            ...input,
            //updatedDate: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        };
        return await tenantModel.updateOne(updatableTenant);
    } catch (error: any) {
        throw error;
    }
};

// DeleteTenant service
export const deleteTenant = async (id: string) => {
    try {
        // Eğer silmek yerine silindi olarak işaretlemek istenirse:
        // const user = await findUserById(id);
        // const updatableUser = {
        //   ...user,
        //   //deletedDate: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        //   //deleterId:res.local.user.id
        // };
        //const updatedUser = await userModel.updateOne(updatableUser);

        let result = await tenantModel.deleteOne({ _id: `${id}` });
        return result;
    } catch (error: any) {
        throw error;
    }
};

// Find Tenant by Id
export const findTenantById = async (id: string) => {
    return await tenantModel.findById(id).lean();
};

// List Tenants with paging
export const queryTenants = async (page: number = 1, items_per_page: number = 10, search: string | any = '', sortField: string | any = '', order: string | any = '') => {
    try {
        let sort = sortField ? JSON.parse(`{"${sortField}":"${order ?? '1'}"}`) : {};

        let filter = { "name": new RegExp(`${search}`, 'i') };
        let data = await tenantModel.find(filter)
            .sort(sort)
            .skip(items_per_page * (page - 1))    // kacinci sayfadan baslanacagi 
            .limit(items_per_page);               // kac kayit alinacagi

        let totalCount = await tenantModel.countDocuments(filter).exec();

        let pagination = getPagination(page, items_per_page, totalCount)
        return {
            data,
            payload: { pagination }
        };
    } catch (error: any) {
        throw error;
    }
};

// Find one tenant by any fields
export const findTenant = async (
    query: FilterQuery<Tenant>,
    options: QueryOptions = {}
) => {
    return await tenantModel.findOne(query, {}, options);
};
