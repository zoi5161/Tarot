import { Request, Response } from 'express';
import { createProduct } from '../services/ProductService';

export const createProductController = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const newProduct = await createProduct(productData);
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product', error: error });
  }
};