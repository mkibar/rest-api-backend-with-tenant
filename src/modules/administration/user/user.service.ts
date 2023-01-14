import { omit, get } from 'lodash';
import { FilterQuery, QueryOptions } from 'mongoose';
import config from 'config';
import userModel, { User } from './user.model';
import { excludedFields } from '../../_auth/auth.controller';
import { signJwt } from '../../../utils/jwt';
import redisClient from '../../../utils/connectRedis';
import { DocumentType } from '@typegoose/typegoose';
import { getPagination } from '../../../utils/paginationHelper';

// CreateUser service
export const createUser = async (input: Partial<User>) => {
  try {
    const user = await userModel.create(input);
    return omit(user.toJSON(), excludedFields);
  } catch (error: any) {
    throw error;
  }
};

// UpdateUser service
export const updateUser = async (id: string, input: Partial<User>) => {
  try {
    const user = await findUserById(id);    // TODO: add tenant filter
    const updatableUser = {
      ...user,
      ...input,
      //updatedDate: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };
    const updatedUser = await userModel.updateOne(updatableUser);
    return omit(updatedUser, excludedFields);
  } catch (error: any) {
    throw error;
  }
};

// DeleteUser service
export const deleteUser = async (id: string) => {
  try {
    // Eğer silmek yerine silindi olarak işaretlemek istenirse:
    // const user = await findUserById(id);
    // const updatableUser = {
    //   ...user,
    //   //deletedDate: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    //   //deleterId:res.local.user.id
    // };
    //const updatedUser = await userModel.updateOne(updatableUser);

    let result = await userModel.deleteOne({ _id: `${id}` });   // TODO: add tenant filter
    return result;
  } catch (error: any) {
    throw error;
  }
};

// Find User by Id
export const findUserById = async (id: string) => {
  const user = await userModel.findById(id).lean();   // TODO: add tenant filter
  return omit(user, excludedFields);
};

// Find All users
export const findAllUsers = async () => {
  return await userModel.find();
};

// List users with paging
//export const listUsers  = async (page : number = 0, limit: number = 2, sort = '') => {
export const queryUsers = async (page: number = 1, items_per_page: number = 10, search: string | any = '', sortField: string | any = '', order: string | any = '') => {
  try {
    let sort = sortField ? JSON.parse(`{"${sortField}":"${order ?? '1'}"}`) : {};

    let filter = {
      $or: [
        { "name": new RegExp(`${search}`, 'i') },
        { "email": new RegExp(`${search}`, 'i') }]
    };
    // TODO: add tenant filter
    let data = await userModel.find(filter)
      //.populate('tenant')
      .sort(sort)
      .skip(items_per_page * (page - 1))    // kacinci sayfadan baslanacagi 
      .limit(items_per_page);                // kac kayit alinacagi

    let totalCount = await userModel.countDocuments(filter).exec();

    let pagination = getPagination(page, items_per_page, totalCount)
    return {
      data,
      payload: { pagination }
    };
  } catch (error: any) {
    throw error;
  }
};

// Find one user by any fields
export const findUser = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  // TODO: add tenant filter
  return await userModel.findOne(query, {}, options).select('+password');
};

// Sign Token
export const signToken = async (user: DocumentType<User>) => {

  // Sign the access token        // TODO: add tenantId
  const access_token = signJwt(
    { sub: user._id },
    { expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`, }
  );

  let u = omit(user.toJSON(), excludedFields);    // Redis'e password olmadan yazmak için password alanını çıkart

  // Create a Session
  redisClient.set(user._id.toString(), JSON.stringify(u), {
    EX: 60 * 60,
  });

  // Return access token
  return { access_token };
};
