import permissionModel from '../modules/administration/permission/permission.model';
import roleModel from '../modules/administration/role/role.model';
import tenantModel from '../modules/administration/tenant/tenant.model';
import userModel from '../modules/administration/user/user.model';
import userRoleModel from '../modules/administration/userrole/userrole.model';
import organizationUnitModel from '../modules/common/organizationunit/organizationunit.model';

const defaultTenantData = { name: "Default Tenant", isEnabled: true }
const defaultRoleData = [{ name: "admin", tenant: '' }, { name: "tenantadmin", tenant: '' }, { name: "user", tenant: '' }]
const defaultUserData = {
    email: "jd@jd.com",
    isEnabled: true,
    name: 'John',
    lastName: 'Doe',
    password: 'demodemo',
    tenant: '',
    role: 'admin'    // TODO: will delete
}
const defaultOrganizationUnitData = [{ name: "Merkez", tenant: '', parent: null }, { name: "Marmara", tenant: '', parent: null }, { name: "İstanbul", tenant: '', parent: null }]

// Genel tanım tabloları için default verileri ekler
const RunDbSeeder = async () => {
    try {
        const tenantExist = await tenantModel.countDocuments({ name: defaultTenantData.name });
        if (!tenantExist) {
            console.log('Tenant does not exist! Seeder starting...');
            // tenant ekle
            const tenant = await tenantModel.create(defaultTenantData);

            defaultRoleData[0].tenant = tenant._id.toString();
            defaultRoleData[1].tenant = tenant._id.toString();
            defaultRoleData[2].tenant = tenant._id.toString();

            // rolleri ekle
            const role1 = await roleModel.create(defaultRoleData[0]);
            const role2 = await roleModel.create(defaultRoleData[1]);
            const role3 = await roleModel.create(defaultRoleData[2]);

            // user ekle
            defaultUserData.tenant = tenant._id.toString();
            const user = await userModel.create(defaultUserData);

            // user rollerini ekle
            const userRoleData1 = { user: user._id.toString(), role: role1._id.toString(), tenant: tenant._id.toString() }
            await userRoleModel.create(userRoleData1);
            const userRoleData2 = { user: user._id.toString(), role: role2._id.toString(), tenant: tenant._id.toString() }
            await userRoleModel.create(userRoleData2);
            const userRoleData3 = { user: user._id.toString(), role: role3._id.toString(), tenant: tenant._id.toString() }
            await userRoleModel.create(userRoleData3);

            // user için permission ekle
            const permissionData1 = { code: 'Gzcm.Administration.Tenant', displayName: 'Manage Tenant', user: user._id.toString(), order: 1, tenant: tenant._id.toString() }
            await permissionModel.create(permissionData1);
            const permissionData2 = { code: 'Gzcm.Administration.Tenant.Add', parentCode: 'Gzcm.Administration.Tenant', displayName: 'Manage Tenant > Add', user: user._id.toString(), order: 1, tenant: tenant._id.toString() }
            await permissionModel.create(permissionData2);
            const permissionData3 = { code: 'Gzcm.Administration.Tenant.Update', parentCode: 'Gzcm.Administration.Tenant', displayName: 'Manage Tenant > Update', user: user._id.toString(), order: 1, tenant: tenant._id.toString() }
            await permissionModel.create(permissionData3);
            // role için permission ekle
            const permissionData4 = { code: 'Gzcm.Administration.Tenant', displayName: 'Manage Tenant', role: role1._id.toString(), order: 1, tenant: tenant._id.toString() }
            await permissionModel.create(permissionData4);
            const permissionData5 = { code: 'Gzcm.Administration.Tenant.Add', parentCode: 'Gzcm.Administration.Tenant', displayName: 'Manage Tenant > Add', role: role1._id.toString(), order: 1, tenant: tenant._id.toString() }
            await permissionModel.create(permissionData5);
            const permissionData6 = { code: 'Gzcm.Administration.Tenant.Update', parentCode: 'Gzcm.Administration.Tenant', displayName: 'Manage Tenant > Update', role: role1._id.toString(), order: 1, tenant: tenant._id.toString() }
            await permissionModel.create(permissionData6);

            defaultOrganizationUnitData[0].tenant = tenant._id.toString();
            defaultOrganizationUnitData[1].tenant = tenant._id.toString();
            defaultOrganizationUnitData[2].tenant = tenant._id.toString();

            // organizationunit verilerini ekle
            const ou1 = await organizationUnitModel.create(defaultOrganizationUnitData[0]);
            defaultOrganizationUnitData[1].parent = ou1._id;
            const ou2 = await organizationUnitModel.create(defaultOrganizationUnitData[1]);
            defaultOrganizationUnitData[2].parent = ou2._id;
            await organizationUnitModel.create(defaultOrganizationUnitData[2]);

            console.log('Seeder completed');
        }
    } catch (error: any) {
        throw error;
    }
}

export default RunDbSeeder;