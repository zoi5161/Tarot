import express, { Request, Response } from 'express';
import { createProductController } from '../controllers/ProductController';
import Product from '../models/ProductModel';

const router = express.Router();

router.post('/products', async (req: Request, res: Response) => {
  try {
    await createProductController(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find(); 
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving products', error: error });
  }
});

router.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const updatedProductData = req.body;

    // Cập nhật sản phẩm trong database
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product', error: error });
  }
});

router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    // Tìm và xóa sản phẩm trong cơ sở dữ liệu
    const deletedProduct = await Product.findByIdAndDelete(productId);

    res.status(200).json({
      message: 'Product deleted successfully',
      product: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product', error: error });
  }
});

export default router;
