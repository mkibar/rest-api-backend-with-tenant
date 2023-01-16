import {
    getModelForClass,
    modelOptions,
    prop,
    Ref,
} from '@typegoose/typegoose';
import { Tenant } from '../tenant/tenant.model';

@modelOptions({
    schemaOptions: {
        timestamps: true,                   // Add createdAt and updatedAt fields
        //versionKey: false,                // __v property sini ekleme
        toJSON: { virtuals: true, transform: function (doc, ret) { delete ret._id; delete ret.__v; } },
        toObject: { virtuals: true }
    }
})
export class Role {
    @prop({ required: true })
    name: string;

    @prop({
        required: true,
        ref: 'Tenant'
    })
    public tenant: Ref<Tenant>
}

// Create the role model from the Role class
const roleModel = getModelForClass(Role);
export default roleModel;
