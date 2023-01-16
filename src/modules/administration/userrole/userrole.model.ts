import {
    getModelForClass,
    modelOptions,
    prop,
    Ref,
} from '@typegoose/typegoose';
import { Role } from '../role/role.model';
import { Tenant } from '../tenant/tenant.model';
import { User } from '../user/user.model';

@modelOptions({
    schemaOptions: {
        timestamps: true,                   // Add createdAt and updatedAt fields
        //versionKey: false,                // __v property sini ekleme
        toJSON: { virtuals: true, transform: function (doc, ret) { delete ret._id; delete ret.__v; } },
        toObject: { virtuals: true }
    }
})
export class UserRole {
    @prop({
        required: true,
        ref: 'User'
    })
    public user: Ref<User>

    @prop({
        required: true,
        ref: 'Role'
    })
    public role: Ref<Role>

    @prop({
        required: true,
        ref: 'Tenant'
    })
    public tenant: Ref<Tenant>
}

// Create the userRole model from the UserRole class
const userRoleModel = getModelForClass(UserRole);
export default userRoleModel;
