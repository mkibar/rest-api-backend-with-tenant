import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';
import { Mixed, ObjectId } from 'mongoose';
import { Tenant } from '../tenant/tenant.model';

@index({ email: 1 })
@pre<User>('save', async function () {
  // Hash password if the password is new or was updated
  if (!this.isModified('password')) return;

  // Hash password with costFactor of 12
  this.password = await bcrypt.hash(this.password, 12);
})
@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true,
    versionKey: false,            // __v property sini ekleme
    toJSON: { virtuals: true, transform: function (doc, ret) { delete ret._id } },
    toObject: { virtuals: true }
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})

// Export the User class to be used as TypeScript type
export class User {
  @prop()
  name: string;

  @prop({ refPath: 'name' })
  first_name: string;

  @prop({ unique: true, required: true })
  email: string;

  @prop({ required: true, minlength: 8, maxLength: 32, select: false })
  password: string;

  @prop({ default: 'user' })
  role: string;

  @prop({ required: true, ref: 'Tenant' })
  public tenant: Ref<Tenant>

  // Instance method to check if passwords match
  async comparePasswords(hashedPassword: string, candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

// Create the user model from the User class
const userModel = getModelForClass(User);
export default userModel;
