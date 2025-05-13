import { Request, Response } from 'express';
import OrderService from '../services/OrderService';
import Product from '../models/ProductModel';

class OrderController {
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { name_custom, phone, email, address, orders } = req.body;

      // Kiểm tra thông tin sản phẩm trong đơn hàng
      const products = await Promise.all(
        orders.map(async (item: any) => {
          const product = await Product.findById(item.productId);
          if (!product) {
            throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
          }

          return {
            productId: item.productId,
            quantity: item.quantity,
          };
        })
      );

      // Tạo dữ liệu order
      const orderData = {
        customerName: name_custom,
        phone,
        email,
        address,
        products,
      };

      // Tạo đơn hàng
      const newOrder = await OrderService.createOrder(orderData);

      res.status(201).json({
        success: true,
        message: 'Đơn hàng đã được tạo thành công',
        order: newOrder,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi tạo đơn hàng',
      });
    }
  }

  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, status } = req.body;

      // Cập nhật trạng thái đơn hàng
      const updatedOrder = await OrderService.updateOrderStatus(orderId, status);

      if (updatedOrder) {
        res.status(200).json({
          success: true,
          message: 'Trạng thái đơn hàng đã được cập nhật thành công',
          order: updatedOrder,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng',
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng',
      });
    }
  }

  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json({
        success: true,
        orders: orders,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng',
      });
    }
  }

  static async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      
      // Gọi service để xóa đơn hàng và cập nhật kho
      await OrderService.deleteOrderAndUpdateStock(orderId);

      res.status(200).json({
        success: true,
        message: 'Đơn hàng đã được xóa và kho đã được cập nhật.',
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi xóa đơn hàng',
      });
    }
  }
}

export default OrderController;
