import mongoose from 'mongoose';
import config from 'config';

export const dbUrl = `mongodb://${config.get('dbName')}:${config.get(
  'dbPass'
)}@localhost:27027/gozcum?authSource=admin`;

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(dbUrl);
    console.log('Database connected...');
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};


export const conn = mongoose.connection;
// // mongoose transaction kullanımı
// const session = await conn.startSession();
//  try {
//   session.startTransaction();
//    const user = await User.create([{ name: 'Van Helsing' }], { session });
//    await ShippingAddress.create([{ address: 'Transylvania', user_id: user.id }], { session });
//   await session.commitTransaction();
//    console.log('success');
//  } catch (error) {
//    console.log('error');
//   await session.abortTransaction();
// }
//   session.endSession();

export default connectDB;
