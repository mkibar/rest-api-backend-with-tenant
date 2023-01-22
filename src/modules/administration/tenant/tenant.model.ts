import {
    getModelForClass,
    modelOptions,
    prop,
} from '@typegoose/typegoose';

@modelOptions({
    schemaOptions: {
        timestamps: true,               // Add createdAt and updatedAt fields
        versionKey: false,              // __v property sini ekleme
        toJSON: { virtuals: true, transform: function (doc, ret) { delete ret._id } },
        toObject: { virtuals: true }
    }
})
// Export the Tenant class to be used as TypeScript type
export class Tenant {
    @prop()
    name: string;

    @prop({ default: true })
    isEnabled: boolean;

    // @prop()
    // public createdUserId: string;

    // @prop()
    // public updatededUserId: string; 
}

// Create the tenant model from the Tenant class
const tenantModel = getModelForClass(Tenant);
export default tenantModel;
