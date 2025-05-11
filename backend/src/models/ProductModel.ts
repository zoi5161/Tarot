import mongoose, { Schema, Document } from 'mongoose';

interface Product extends Document {
  image: string;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  stock: number;
}

const productSchema = new Schema<Product>({
  image: { type: String, required: true },
  name: { type: String, required: true },
  nameEn: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const Product = mongoose.model<Product>('Product', productSchema);
export default Product;