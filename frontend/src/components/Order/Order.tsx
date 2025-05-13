import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Order.module.css';

const Order = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [orderForm, setOrderForm] = useState({
  customerName: '',
  phone: '',
  email: '',
  address: '',
  products: [] as { productId: string, quantity: number }[], // Mảng sản phẩm trong đơn hàng
  status: false, // Trạng thái đơn hàng, mặc định là chưa giao
  createdAt: new Date().toISOString(), // Thêm trường createdAt, mặc định là thời điểm hiện tại
  });

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:1234/api/orders');
      
      // Kiểm tra xem response.data.orders có phải là mảng không
      if (Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);  // Cập nhật danh sách đơn hàng nếu là mảng
      } else {
        setOrders([]);  // Nếu không phải mảng, đặt orders thành mảng rỗng
        console.error('Dữ liệu không phải là mảng:', response.data.orders);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(orders => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return (
      orders.customerName.toLowerCase().includes(lowerSearchQuery) ||
      orders.address.toLowerCase().includes(lowerSearchQuery) ||
      orders.phone.includes(lowerSearchQuery) ||
      orders.email.toLowerCase().includes(lowerSearchQuery)
    );
  });

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClosePopup();
    }
  };

  const handleOutsideDeleteClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancelDelete();
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleEditClick = (order: any) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const handleDeleteClick = (order: any) => {
    setSelectedOrder(order);
    setShowDeleteConfirmation(true);  // Hiển thị popup xác nhận xóa
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:1234/api/orders/${selectedOrder._id}`);
      console.log('Order deleted:', response.data);
      setShowDeleteConfirmation(false);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleStatusChange = async (orderId: string) => {
    try {
      const response = await axios.put('http://localhost:1234/api/orders/status', {
        orderId,
        status: true,
      });

      if (response.data.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.containerProduct}>
        <div className={styles.search}>
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Tìm kiếm..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className={styles.searchButton}>
            <img src="searchIcon.png" alt="" />
          </button>
        </div>

        <div className={styles.productTable}>
          {filteredOrders.map((order) => (
            <div key={order._id} className={styles.productCard}>
              <div className={styles.leftTable}>
                <div  className={styles.productImageContainer}>
                  <img src="/iconCustomer.png" alt="" />
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.infoProductName}><strong>Khách hàng: </strong> {order.customerName}</div>
                  <div className={styles.infoProduct}><strong>Địa chỉ: </strong>{order.address}</div>
                  <div className={styles.infoProduct}><strong>SĐT: </strong>{order.phone}</div>
                  <div className={styles.infoProduct}><strong>Email: </strong>{order.email}</div>
                  <div className={styles.infoProduct}><strong>Tổng đơn: </strong>
                    {order.products && formatCurrency(order.products.reduce((total: number, product: { productId: { price: number; }; quantity: number; }) => {
                      return total + product.productId.price * product.quantity;
                    }, 0))}
                  </div>
                  <div className={styles.infoProduct}>
                    <strong>Trạng thái: </strong>{order.status ? 'Đã giao' : 'Chưa giao'}
                    {!order.status && (
                      <button className={styles.checkButton} onClick={() => handleStatusChange(order._id)}>
                        <img className={styles.checkImage} src="/check.png" alt="Đánh dấu đã giao" />
                      </button>
                    )}
                  </div>
                  <div className={styles.infoProduct}><strong>Ngày tạo: </strong>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
              <div className={styles.rightTable}>
                <button className={styles.editButton} onClick={() => handleEditClick(order)}>
                  Xem chi tiết
                </button>
                  {order.status !== true && (
                    <button className={styles.removeButton} onClick={() => handleDeleteClick(order)}>
                      Xoá
                    </button>
                  )}
              </div>
            </div>
          ))}
          {/* Popup Form */}
            {showPopup && (
            <div className={styles.popup} onClick={handleOutsideClick}>
                <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closePopup} onClick={handleClosePopup}>X</button>
                <div className={styles.titlePopup}>Chi tiết đơn hàng</div>

                {/* Hiển thị danh sách sản phẩm trong đơn hàng */}
                <div className={styles.productsContainer}>
                    {selectedOrder.products && selectedOrder.products.map((product: { productId: any, quantity: number }, index: number) => (
                    <div key={index} className={styles.productItem}>
                        {/* Hiển thị ảnh sản phẩm */}
                        <div className={styles.productImageContainer}>
                        <img
                            src={`http://localhost:1234${product.productId?.image}`} // Giả sử bạn có URL ảnh từ product.productId
                            alt={product.productId?.name} // Hiển thị tên sản phẩm
                            className={styles.productImage}
                        />
                        </div>

                        <div className={styles.productInfo}>
                        {/* Hiển thị tên sản phẩm */}
                        <div className={styles.productInfoName}><strong>Tên: </strong>{product.productId.name}</div>
                        {/* Hiển thị giá sản phẩm */}
                        <div><strong>Giá: </strong>{formatCurrency(product.productId.price)}</div>
                        {/* Hiển thị số lượng */}
                        <div><strong>Số lượng: </strong>{product.quantity}</div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            )}


          {/* Xác nhận xóa sản phẩm */}
          {showDeleteConfirmation && (
            <div className={styles.popup} onClick={handleOutsideDeleteClick}>
              <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.askDel}>Bạn có chắc muốn xóa đơn hàng này?</div>
                <div className={styles.buttonGroup}>
                  <button className={styles.confirmButton} onClick={handleConfirmDelete}>Xoá</button>
                  <button className={styles.cancelButton} onClick={handleCancelDelete}>Hủy</button>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default Order;