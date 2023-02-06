import { FilterQuery, QueryOptions } from 'mongoose';
import organizationUnitModel, { OrganizationUnit } from './organizationunit.model';
import { getPagination } from '../../../utils/paginationHelper';
import AppError from '../../../utils/errors/appError';

// CreateOrganizationUnit service
export const createOrganizationUnit = async (input: Partial<OrganizationUnit>) => {
    try {
        const roleExist = await organizationUnitNameExist(input.name as string, input.tenant!.toString());
        if (roleExist)
            throw new AppError('OrganizationUnit name exist', 409);

        const role = await organizationUnitModel.create(input);
        return role.toJSON();
    } catch (error: any) {
        throw error;
    }
};

// UpdateOrganizationUnit service
export const updateOrganizationUnit = async (id: string, input: Partial<OrganizationUnit>) => {
    try {
        const updatableOrganizationUnit = {
            ...input,
            //updatedDate: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        };
        return await organizationUnitModel.findByIdAndUpdate(id, updatableOrganizationUnit, { new: true });
    } catch (error: any) {
        throw error;
    }
};

// DeleteOrganizationUnit service
export const deleteOrganizationUnit = async (id: string) => {
    try {
        let result = await organizationUnitModel.deleteOne({ _id: `${id}` });
        return result;
    } catch (error: any) {
        throw error;
    }
};

// List OrganizationUnits with paging
export const queryOrganizationUnits = async (tenantId: string, page: number = 1, items_per_page: number = 10, search: string | any = '', sortField: string | any = '', order: string | any = '') => {
    try {
        let sort = sortField ? JSON.parse(`{"${sortField}":"${order ?? '1'}"}`) : {};

        // let filter = {
        //     $and: [
        //         { "tenant": tenantId },
        //         { "name": new RegExp(`${search}`, 'i') }
        //     ],
        // }
        const filter: FilterQuery<OrganizationUnit> = { tenant: tenantId };
        if (!search)
            filter.name = new RegExp(`${search}`, 'i');

        let data = await organizationUnitModel.find(filter)
            .sort(sort)
            .skip(items_per_page * (page - 1))    // kacinci sayfadan baslanacagi 
            .limit(items_per_page);               // kac kayit alinacagi

        let totalCount = await organizationUnitModel.countDocuments(filter).exec();

        let pagination = getPagination(page, items_per_page, totalCount)
        return {
            data,
            payload: { pagination }
        };
    } catch (error: any) {
        throw error;
    }
};

// Find OrganizationUnit by Id
export const findOrganizationUnitById = async (id: string) => {
    return await organizationUnitModel.findById(id);
};

// Find one role by any fields
export const findOrganizationUnit = async (
    query: FilterQuery<OrganizationUnit>,
    options: QueryOptions = {}
) => {
    return await organizationUnitModel.findOne(query, {}, options);
};

// OrganizationUnit name and Tenant exist
export const organizationUnitNameExist = async (name: string, tenantId: string) => {
    try {
        return await organizationUnitModel.exists({ name: name, tenant: tenantId });
    } catch (error: any) {
        throw error;
    }
};