import {
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';
import { Permission } from '../permission/permission.model';
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
    timestamps: true,             // Add createdAt and updatedAt fields
    //versionKey: false,            // __v property sini ekleme
    toJSON: { virtuals: true, transform: function (doc, ret) {  ret.id = ret._id; delete ret._id; delete ret.__v; return ret;  } },
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

  @prop()
  lastName: string;

  @prop({ unique: true, required: true, trim: true })
  email: string;

  @prop({ required: true, minlength: 8, maxLength: 32, select: false })
  password: string;

  @prop({ default: true })
  isEnabled: boolean;

  // TODO: will delete
  @prop({ default: 'user' })
  role: string;

  @prop({
    required: true,
    ref: () => Tenant
  })
  public tenant: Ref<Tenant>

  @prop()
  emailConfirmed?: boolean;

  @prop({ default: false })
  lockoutEnabled?: boolean;

  @prop()
  lockoutEnd?: Date;

  @prop({ default: 0 })
  accessFailedCount?: number;

  @prop({ default: false })
  isVerified: boolean;

  @prop()
  passwordChangeDate?: Date;

  @prop()
  // kullanicinin son giris yapabilecegi tarih
  loginEndDate?: Date;

  @prop({
    ref: () => Permission,
    foreignField: 'user',
    localField: '_id',
    justOne: false
  })
  public permissions?: Ref<Permission>[];

  // @prop()
  // public createdUserId: string;

  // @prop()
  // public updatededUserId: string;

  // this will create a virtual property called 'fullName'
  public get fullName() {
    return `${this.name} ${this.lastName}`;
  }

  // Instance method to check if passwords match
  async comparePasswords(hashedPassword: string, candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

// Create the user model from the User class
const userModel = getModelForClass(User);
export default userModel;
