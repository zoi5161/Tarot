import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import ProductCard from '../../components/ProductCard/ProductCard';
import Navbar from '../../components/Navbar';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles';
import styles from './Shop.module.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageSrc: string;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); 
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]); 
  const [showModal, setShowModal] = useState(false); 
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Trạng thái popup thông báo
  const [popupTimeout, setPopupTimeout] = useState<NodeJS.Timeout | null>(null); // Dùng để xử lý việc tự động ẩn popup sau 10s


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products.txt');
        const text = await response.text();

        const productsArray: Product[] = text.split('\n').map((line) => {
          const [id, name, description, price, imageSrc] = line.split('|');
          return {
            id: parseInt(id),
            name,
            description,
            price: parseFloat(price),
            imageSrc,
          };
        });

        setProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const addToCart = (product: Product) => {
    const existingProductIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingProductIndex === -1) {
      setCart([...cart, { product, quantity: 1 }]);
    } else {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
    }
  };

  const decreaseQuantity = (product: Product) => {
    const existingProductIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      if (updatedCart[existingProductIndex].quantity > 1) {
        updatedCart[existingProductIndex].quantity -= 1;
        setCart(updatedCart);
      } else {
        updatedCart.splice(existingProductIndex, 1);
        setCart(updatedCart);
      }
    }
  };

  const totalAmount = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  const handleCheckout = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const name_custom = (form.name as unknown as HTMLInputElement).value;
    const phone = form.phone.value;
    const email = form.email.value;
    const address = form.address.value;

    if (!phoneRegex.test(phone)) {
        alert('Số điện thoại không hợp lệ. Vui lòng nhập lại.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('Email không hợp lệ. Vui lòng nhập lại.');
        return;
    }

    // Tính toán giá trị tổng tiền từ giỏ hàng
    const totalAmount = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

    // Khai báo các giá trị cost
    const cost = {
        shipping: '50,000 VNĐ',  // Phí vận chuyển
        tax: '5,000 VNĐ',  // Thuế
        total: totalAmount,  // Tổng số tiền giỏ hàng
    };
    const grandTotal = cost.total + cost.shipping + cost.tax;
    // Gửi email qua EmailJS với các giá trị thay thế vào template
    emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID as string, // Service ID từ biến môi trường
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID as string, // Template ID từ biến môi trường
        {
        to_email: email, // Email người nhận
        link_logo: 'https://yourdomain.com/logo.png', // Đường dẫn logo
        order_id: 'ID0012', // Mã đơn hàng
        name_custom: name_custom, // Tên khách hàng
        phone: phone, // Số điện thoại
        address: address, // Địa chỉ
        orders: cart.map(item => ({
            link_image: item.product.imageSrc,
            name_order: item.product.name,
            units: item.quantity,
            price: item.product.price,
        })),
        cost: cost, // Truyền giá trị cost vào
        grandTotal: grandTotal,  // Truyền giá trị cost vào
        email: email, // Email khách hàng
        },
        process.env.REACT_APP_EMAILJS_USER_ID as string  // User ID từ biến môi trường
    ).then(() => {
        // Sau khi thanh toán thành công, xóa giỏ hàng và hiển thị popup thông báo
        setCart([]); // Xóa giỏ hàng
        setShowSuccessPopup(true); // Hiển thị popup

        // Thiết lập timeout để tự động tắt popup sau 10 giây
        if (popupTimeout) clearTimeout(popupTimeout); // Hủy timeout cũ nếu có
        const timeout = setTimeout(() => {
        setShowSuccessPopup(false); // Ẩn popup sau 10 giây
        }, 10000);
        setPopupTimeout(timeout);

        closeModal(); // Đóng modal
    }).catch((error) => {
        console.error('Có lỗi xảy ra khi gửi email:', error);
    });
    };

  return (
    <div className={styles.container}>
      <div className={styles.containerWelcome}>
        <Navbar />
        <h1 className={styles.title}>Chào mừng đến với cửa hàng của chúng tôi!</h1>
      </div>
      <div className={styles.containerOurInfor}>
        <FloatingParticles count={200} />
        <div className={styles.productList}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              imageSrc={product.imageSrc}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>

        <div className={styles.shoppingCart}>
          <h2>Giỏ hàng</h2>
          {cart.map((item) => (
            <div key={item.product.id} className={styles.cartItem}>
              <img src={item.product.imageSrc} alt={item.product.name} className={styles.cartItemImage} />
              <div className={styles.cartItemDetails}>
                <h3>{item.product.name}</h3>
                <p>{formatCurrency(item.product.price)}</p>
                <div className={styles.quantityControls}>
                  <button onClick={() => decreaseQuantity(item.product)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item.product)}>+</button>
                </div>
              </div>
            </div>
          ))}

          <div className={styles.cartSummary}>
            <h3 className={styles.totalPrice}>Tổng tiền: {formatCurrency(totalAmount)}</h3>
            <button className={styles.checkoutButton} onClick={handleCheckout}>
              Thanh toán
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Nhập thông tin cá nhân</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Tên:
                <input type="text" name="name" required />
              </label>
              <label>
                Địa chỉ:
                <input type="text" name="address" required />
              </label>
              <label>
                Số điện thoại:
                <input type="number" name="phone" required />
              </label>
              <label>
                Email:
                <input type="email" name="email" required />
              </label>
              <button type="submit">Xác nhận</button>
              <button type="button" onClick={closeModal}>Đóng</button>
            </form>
          </div>
        </div>
      )}

      {/* Popup thông báo mua hàng thành công */}
        {showSuccessPopup && (
        <div className={styles.successPopup}>
            <div className={styles.popupContent}>
            <span className={styles.closePopup} onClick={() => setShowSuccessPopup(false)}>X</span>
            <h3>Mua hàng thành công!</h3>
            <p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn đã được xác nhận.</p>
            </div>
        </div>
        )}
    </div>
  );
};

export default Shop;
