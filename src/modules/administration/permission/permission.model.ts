import {
    getModelForClass,
    modelOptions,
    prop,
    Ref,
} from '@typegoose/typegoose';
import { Role } from '../role/role.model';
import { Tenant } from '../tenant/tenant.model';
import { User } from '../user/user.model';

// @modelOptions({
//     schemaOptions: {
//         timestamps: true,                   // Add createdAt and updatedAt fields
//         //versionKey: false,                // __v property sini ekleme
//         toJSON: { virtuals: true, transform: function (doc, ret) { delete ret._id; delete ret.__v; } },
//         toObject: { virtuals: true }
//     }
// })
// export class BaseClass {
//     @prop()
//     creatorId : string;

//     @prop()
//     updaterId : string;

//     @prop()
//     deleterId : string;

//     @prop()
//     deletedAt : Date;

// }

@modelOptions({
    schemaOptions: {
        timestamps: true,                   // Add createdAt and updatedAt fields
        //versionKey: false,                // __v property sini ekleme
        toJSON: { virtuals: true, transform: function (doc, ret) { delete ret._id; delete ret.__v; } },
        toObject: { virtuals: true }
    }
})
export class Permission {
    @prop({ required: true })
    code: string

    @prop()
    parentCode: string

    @prop()
    displayName: string

    @prop()
    isEnabled: boolean

    @prop({ required: true, ref: 'Tenant' })
    public tenant: Ref<Tenant>

    @prop({ ref: 'User' })
    // bu yetki satiri bir kullaniciya ait ise bu alan dolu olmalidir
    public user: Ref<User>

    @prop({ ref: 'Role' })
    // bu yetki satiri bir role ait ise bu alan dolu olmalidir
    public role: Ref<Role>

    @prop()
    order: number

    // @prop()
    // public createdUserId: string;

    // @prop()
    // public updatededUserId: string;
}

// Create the permission model from the Permission class
const permissionModel = getModelForClass(Permission);
export default permissionModel;
