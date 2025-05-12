import mongoose, { Document, Schema } from 'mongoose';

interface IAdmin extends Document {
  username: string;
  password: string;
}

const adminSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const AdminModel = mongoose.model<IAdmin>('Admin', adminSchema);

export default AdminModel;