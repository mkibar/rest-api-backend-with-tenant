import {
    getModelForClass,
    modelOptions,
    prop,
    Ref,
} from '@typegoose/typegoose';
import { Tenant } from '../../administration/tenant/tenant.model';

@modelOptions({
    schemaOptions: {
        timestamps: true,                   // Add createdAt and updatedAt fields
        //versionKey: false,                // __v property sini ekleme
        toJSON: { virtuals: true, transform: function (doc, ret) { delete ret._id; delete ret.__v; } },
        toObject: { virtuals: true }
    }
})
export class OrganizationUnit {
    @prop({ required: true })
    name: string;

    @prop()
    code?: string;

    @prop({
        ref: () => OrganizationUnit
    })
    public parent?: Ref<OrganizationUnit>

    @prop({
        required: true,
        ref: () => Tenant
    })
    public tenant: Ref<Tenant>

    // @prop()
    // public createdUserId: string;

    // @prop()
    // public updatededUserId: string;
}

// Create the organizationUnit model from the OrganizationUnit class
const organizationUnitModel = getModelForClass(OrganizationUnit);
export default organizationUnitModel;
