import Product from '../models/ProductModel';

export const createProduct = async (productData: any) => {
  try {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error('Error saving product: ' + error);
  }
};