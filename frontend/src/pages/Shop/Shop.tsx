import React, { useState, useEffect, useRef } from 'react';
import emailjs from 'emailjs-com';
import ProductCard from '../../components/ProductCard/ProductCard';
import Navbar from '../../components/NavBar/Navbar';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles';
import Footer from '../../components/Footer/Footer';
import styles from './Shop.module.css';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface Product {
  image: string;
  _id: number;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  stock: number;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); 
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]); 
  const [showModal, setShowModal] = useState(false); 
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); 
  const [popupTimeout, setPopupTimeout] = useState<NodeJS.Timeout | null>(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [randomProducts, setRandomProducts] = useState<Product[]>([]); 
  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const shopCardRef = useRef<HTMLDivElement>(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/products`);
      console.log('Products fetched:', response.data);
      setProducts(response.data);
      setRandomProducts(getRandomProducts(response.data, 3));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase()); // Cập nhật query tìm kiếm khi người dùng nhập
  };

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchQuery) || 
    product.description.toLowerCase().includes(searchQuery)
  );

  const addToCart = (product: Product) => {
    const existingProductIndex = cart.findIndex(item => item.product._id === product._id);
    if (existingProductIndex === -1) {
      setCart([...cart, { product, quantity: 1 }]);
    } else {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
    }
  };


  const decreaseQuantity = (product: Product) => {
    const existingProductIndex = cart.findIndex(item => item.product._id === product._id);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const name_custom = (form.name as unknown as HTMLInputElement).value;
    const phone = form.phone.value;
    const email = form.email.value;
    const address = form.address.value;

    // Kiểm tra tính hợp lệ của số điện thoại và email
    if (!phoneRegex.test(phone)) {
      alert('Số điện thoại không hợp lệ. Vui lòng nhập lại.');
      return;
    }

    if (!emailRegex.test(email)) {
      alert('Email không hợp lệ. Vui lòng nhập lại.');
      return;
    }

    // Tính toán tổng tiền từ giỏ hàng
    const totalAmount = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

    // Khai báo các giá trị cost
    let cost = {
      shipping: 50000,  // Phí vận chuyển
      tax: 5000,  // Thuế
      total: totalAmount,  // Tổng số tiền giỏ hàng
    };

    const grandTotal = cost.total + cost.shipping + cost.tax;

    // Tạo đơn hàng trong cơ sở dữ liệu
    try {
      const orderData = {
        name_custom,
        phone,
        email,
        address,
        orders: cart.map(item => ({
          productId: item.product._id,  // Sử dụng _id của sản phẩm
          quantity: item.quantity,
        })),
      };

      // Gửi yêu cầu tới backend để tạo đơn hàng
      const response = await axios.post(`${backendUrl}/api/orders`, orderData);

      if (response.data.success) {
        // Sau khi tạo đơn hàng thành công, gửi email xác nhận
        emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID as string, // Service ID từ biến môi trường
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID as string, // Template ID từ biến môi trường
          {
            to_email: email,
            link_logo: 'https://yourdomain.com/logo.png',
            order_id: response.data.order._id, // Mã đơn hàng từ database
            name_custom: name_custom, // Tên khách hàng
            phone: phone, // Số điện thoại
            address: address, // Địa chỉ
            orders: cart.map(item => ({
              link_image: item.product.image,
              name_order: item.product.name,
              units: item.quantity,
              price: formatCurrency(item.product.price),
            })),
            cost: {
              shipping: formatCurrency(cost.shipping),
              tax: formatCurrency(cost.tax),
              total: formatCurrency(cost.total),
            },
            grandTotal: formatCurrency(grandTotal),
            email: email,
          },
          process.env.REACT_APP_EMAILJS_USER_ID as string // User ID từ biến môi trường
        ).then(() => {
          // Sau khi gửi email thành công, thực hiện các thao tác như xóa giỏ hàng và cập nhật sản phẩm
          setCart([]);
          setShowSuccessPopup(true);

          if (popupTimeout) clearTimeout(popupTimeout);
          const timeout = setTimeout(() => {
            setShowSuccessPopup(false);
          }, 10000);
          setPopupTimeout(timeout);

          closeModal();

          // Cập nhật số lượng sản phẩm trong cơ sở dữ liệu
          cart.forEach(async (item) => {
            const updatedStock = item.product.stock - item.quantity;

            // Gửi PUT request để cập nhật số lượng sản phẩm trong DB
            try {
              await axios.put(`${backendUrl}/api/products/${item.product._id}`, {
                stock: updatedStock,
              });
              console.log(`Stock for ${item.product.name} updated to ${updatedStock}`);
            } catch (error) {
              console.error(`Error updating stock for ${item.product.name}:`, error);
            }
          });
        }).catch((error) => {
          console.error('Có lỗi xảy ra khi gửi email:', error);
        });
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const getRandomProducts = (products: any[], number: number) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, number);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRandomProducts(getRandomProducts(products, 3));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [products]);

  const scrollToShopCard = () => {
    if (shopCardRef.current) {
      shopCardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.containerWelcome}>
        <Navbar />
        <h1 className={styles.title}>TAROCITOPIA SHOP</h1>
        <div className={styles.containerRecommend}>
          <div className={styles.containerRecommend}>
            {randomProducts.map((product) => (
              <div key={product._id} className={styles.recommendCard}>
                <img 
                  src={`${backendUrl}${product.image}`} 
                  alt={product.name} 
                  className={styles.imageRecommendCard} 
                />
                <div>{product.name}</div>
                CHỈ VỚI {formatCurrency(product.price)}
                <button className={styles.buyButton} onClick={scrollToShopCard}>MUA NGAY</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.containerOurInfor} id="ShopCard" ref={shopCardRef}>
        <FloatingParticles count={150} />
        <div className={styles.productListAndSearch}>
          <div className={styles.search}>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Tìm kiếm..." 
              value={searchQuery} 
              onChange={handleSearchChange}
            />
            <button className={styles.searchButton}>
              <img src="searchIcon.png" alt="" />
            </button>
          </div>
          <div className={styles.productList}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                name={product.name}
                nameEn={product.nameEn}
                description={product.description}
                price={product.price}
                stock={product.stock}
                imageSrc={product.image}
                quantity={cart.find(item => item.product._id === product._id)?.quantity || 0}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </div>

        <div className={styles.shoppingCart}>
          <h2>Giỏ hàng</h2>
          <div className={styles.containerBlogImage}>
            <img src="/blogTitle.svg" alt="blogTitle" className={styles.blogImage} />
          </div>
          {cart.map((item) => (
            <div key={item.product._id} className={styles.cartItem}> {/* Dùng _id thay vì id */}
              <img src={`${backendUrl}${item.product.image}`} alt={item.product.name} className={styles.cartItemImage} />
              <div className={styles.cartItemDetails}>
                <h3>{item.product.name}</h3>
                <p>{formatCurrency(item.product.price)}</p>
                <div className={styles.quantityControls}>
                  <button onClick={() => decreaseQuantity(item.product)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item.product)} disabled={item.quantity >= item.product.stock}>+</button>
                </div>
                {item.quantity >= item.product.stock && (
                  <span className={styles.outOfStock}>Hết hàng</span>
                )}
              </div>
            </div>
          ))}


          <div className={styles.cartSummary}>
            <h3 className={styles.totalPrice}>Tổng tiền: {formatCurrency(totalAmount)}</h3>
            <button className={styles.checkoutButton} onClick={handleCheckout} disabled={totalAmount === 0}>
              Thanh toán
            </button>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Modal nhập thông tin cá nhân */}

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
