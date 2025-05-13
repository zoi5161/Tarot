import { Order, IOrder } from '../models/OrderModel';
import Product from '../models/ProductModel';

class OrderService {
  static async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    const { products } = orderData;

    // Kiểm tra sự tồn tại của các sản phẩm trong order
    for (const item of products!) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
      }
    }

    const order = new Order(orderData);
    await order.save();
    return order;
  }

  static async updateOrderStatus(orderId: string, status: boolean): Promise<IOrder | null> {
    // Cập nhật trạng thái đơn hàng (giao thành công)
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    return order;
  }

  static async getAllOrders(): Promise<IOrder[]> {
    // Trả về tất cả đơn hàng
    return Order.find().populate('products.productId'); // Populate sản phẩm nếu cần
  }

  // Xóa đơn hàng và cập nhật số lượng sản phẩm trong kho
  static async deleteOrderAndUpdateStock(orderId: string): Promise<void> {
    try {
      const order = await Order.findById(orderId).populate('products.productId');
      if (!order) {
        throw new Error('Không tìm thấy đơn hàng');
      }

      // Cập nhật kho: tăng số lượng sản phẩm
      for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
        }
        product.stock += item.quantity; // Tăng số lượng vào kho
        await product.save();
      }

      // Xóa đơn hàng
      await Order.findByIdAndDelete(orderId);
    } catch (error) {
      throw new Error('Error deleting order and updating stock: ' + error);
    }
  }
}

export default OrderService;
