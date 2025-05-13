import mongoose, { Schema, Document } from 'mongoose';
import Product from './ProductModel';

interface IProduct {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

interface IOrder extends Document {
  customerName: string;
  address: string;
  phone: string;
  email: string;
  products: IProduct[];
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  // Sử dụng ObjectId của Product
        quantity: { type: Number, required: true },
      },
    ],
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export { Order, IOrder };