import React, { useEffect, useState } from 'react';
import styles from './Manage.module.css';
import Product from '../../components/Product/Product';
import Blog from '../../components/Blog/Blog';
import Order from '../../components/Order/Order';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Manage = () => {
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState('Sản phẩm');
  const [showPopup, setShowPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState({
    image: '',
    name: '',
    nameEn: '',
    description: '',
    price: '',
    stock: ''
  });
  const [blogForm, setBlogForm] = useState({
    image: '',
    title: '',
    shortDescription: '',
    content: '',
    publishDate: ''
  });
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    products: [] as { productId: string, quantity: number }[], // Mảng sản phẩm trong đơn hàng
    status: false, // Trạng thái đơn hàng, mặc định là chưa giao
    createdAt: new Date().toISOString(), // Thêm trường createdAt, mặc định là thời điểm hiện tại
  });


  const handleHomeClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:1234/api/products');
      setProducts(response.data);  // Cập nhật danh sách sản phẩm vào state
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:1234/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:1234/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClosePopup();
    }
  };

  const handleTagClick = (tag: React.SetStateAction<string>) => {
    setSelectedTag(tag);
  };

  const handleAddButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    if (selectedTag === 'Sản phẩm') {
      setProductForm({
        image: '',
        name: '',
        nameEn: '',
        description: '',
        price: '',
        stock: ''
      });
    } else {
      setBlogForm({
        image: '',
        title: '',
        shortDescription: '',
        content: '',
        publishDate: ''
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const formData = new FormData();
      formData.append('image', files[0]);

      try {
        const response = await axios.post('http://localhost:1234/api/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const imageUrl = response.data.imageUrl; // URL của ảnh đã upload

        if (selectedTag === 'Sản phẩm') {
          setProductForm((prev) => ({
            ...prev,
            image: imageUrl, // Lưu URL ảnh vào trường image
          }));
        } else {
          setBlogForm((prev) => ({
            ...prev,
            image: imageUrl, // Lưu URL ảnh vào trường image
          }));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Xử lý đặc biệt cho trường "price"
    if (name === "price") {
      // Loại bỏ dấu chấm và chuyển thành số
      const numericValue = value.replace(/\./g, ''); // Loại bỏ tất cả dấu chấm
      setProductForm((prev) => ({
        ...prev,
        [name]: numericValue // Cập nhật lại giá trị số
      }));
    } else {
      if (selectedTag === 'Sản phẩm') {
        setProductForm((prev) => ({
          ...prev,
          [name]: value
        }));
      } else if (selectedTag === 'Đơn hàng') {
        setOrderForm((prev) => ({
          ...prev,
          [name]: value
        }));
      } else {
        setBlogForm((prev) => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlogForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      let data;
      let apiUrl = '';

      if (selectedTag === 'Sản phẩm') {
        data = productForm;
        apiUrl = 'http://localhost:1234/api/products';
      } else if (selectedTag === 'Bài viết') {
        const formattedPublishDate = formatDate(blogForm.publishDate);
        const formattedBlogForm = {
          ...blogForm,
          publishDate: formattedPublishDate,
        };

        data = formattedBlogForm;
        apiUrl = 'http://localhost:1234/api/blogs';
      } else if (selectedTag === 'Đơn hàng') {
        data = orderForm;
        apiUrl = 'http://localhost:1234/api/orders';
      }

      // Gửi yêu cầu POST tới backend
      const response = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Data uploaded successfully:', response.data);
      setShowPopup(false);
      fetchProducts();
      fetchBlogs();
      fetchOrders();
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetchProducts();
    fetchBlogs();
    fetchOrders();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleManage}>Quản lý dữ liệu</div>
        <div className={styles.buttonGroupTop}>
          <button className={styles.homeButton} onClick={handleHomeClick}>Trang chủ</button>
          <button className={styles.addButton} onClick={handleAddButtonClick} style={{ display: selectedTag === 'Đơn hàng' ? 'none' : 'inline-block' }}>Thêm mới</button>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.tagsList}>
          <div className={`${styles.tags} ${selectedTag === 'Sản phẩm' ? styles.selectedTag : ''}`} onClick={() => handleTagClick('Sản phẩm')}>
            Sản phẩm
          </div>
          <div className={`${styles.tags} ${selectedTag === 'Bài viết' ? styles.selectedTag : ''}`} onClick={() => handleTagClick('Bài viết')}>
            Bài viết
          </div>
          <div className={`${styles.tags} ${selectedTag === 'Đơn hàng' ? styles.selectedTag : ''}`} onClick={() => handleTagClick('Đơn hàng')}>
            Đơn hàng
          </div>
        </div>

        <div className={styles.table}>
          {selectedTag === 'Sản phẩm' && <Product />}
          {selectedTag === 'Bài viết' && <Blog />}
          {selectedTag === 'Đơn hàng' && <Order />}
        </div>
      </div>

      {/* Popup Form */}
      {showPopup && (
        <div className={styles.popup} onClick={handleOutsideClick}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closePopup} onClick={handleClosePopup}>X</button>
            <h3>{selectedTag === 'Sản phẩm' ? 'Thêm sản phẩm' : 'Thêm bài viết'}</h3>

            {showPopup && (
              <div
                className={`${styles.popup} ${selectedTag === 'Bài viết' ? styles.popupBlogTag : ''}`}
                onClick={handleOutsideClick}
              >
                <div className={`${styles.popupContent} ${selectedTag === 'Bài viết' ? styles.BlogTag : ''}`} onClick={(e) => e.stopPropagation()}>
                  <button className={styles.closePopup} onClick={handleClosePopup}>X</button>
                  <h3>{selectedTag === 'Sản phẩm' ? 'Thêm sản phẩm' : 'Thêm bài viết'}</h3>

                  {selectedTag === 'Sản phẩm' ? (
                    <>
                      <input
                        type="file"
                        name="image"
                        className={styles.inputPopup}
                        onChange={handleFileChange}
                        placeholder="Link ảnh"
                      />
                      <input
                        type="text"
                        name="name"
                        className={styles.inputPopup}
                        value={productForm.name}
                        onChange={handleFormChange}
                        placeholder="Tên sản phẩm"
                      />
                      <input
                        type="text"
                        name="nameEn"
                        className={styles.inputPopup}
                        value={productForm.nameEn}
                        onChange={handleFormChange}
                        placeholder="Tên tiếng anh"
                      />
                      <input
                        type="text"
                        name="description"
                        className={styles.inputPopup}
                        value={productForm.description}
                        onChange={handleFormChange}
                        placeholder="Mô tả sản phẩm"
                      />
                      <input
                        type="number"
                        name="price"
                        className={styles.inputPopup}
                        value={productForm.price}
                        onChange={handleFormChange}
                        placeholder="Giá sản phẩm"
                      />
                      <input
                        type="number"
                        name="stock"
                        className={styles.inputPopup}
                        value={productForm.stock}
                        onChange={handleFormChange}
                        placeholder="Số lượng tồn kho"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="file"
                        name="image"
                        className={styles.inputPopup}
                        onChange={handleFileChange}
                        placeholder="Link ảnh"
                      />
                      <input
                        type="text"
                        name="title"
                        className={styles.inputPopup}
                        value={blogForm.title}
                        onChange={handleFormChange}
                        placeholder="Tiêu đề"
                      />
                      <input
                        type="text"
                        name="shortDescription"
                        className={styles.inputPopup}
                        value={blogForm.shortDescription}
                        onChange={handleFormChange}
                        placeholder="Mô tả ngắn"
                      />
                      <textarea
                        name="content"
                        value={blogForm.content}
                        className={styles.addTextArea}
                        onChange={handleTextAreaChange}
                        placeholder="Nội dung"
                      />
                      <input
                        type="date"
                        name="publishDate"
                        className={styles.inputPopup}
                        value={blogForm.publishDate}
                        onChange={handleFormChange}
                      />
                    </>
                  )}
                  <button className={styles.submitButton} onClick={handleSubmit}>Đăng</button>
                </div>
              </div>
            )}

            <button className={styles.submitButton} onClick={handleSubmit}>Đăng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manage;
