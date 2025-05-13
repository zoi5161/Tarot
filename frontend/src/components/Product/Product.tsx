import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Product.module.css';

const Product = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);  // Khai báo state để lưu danh sách sản phẩm
  const [loading, setLoading] = useState(true);  // Khai báo state để quản lý trạng thái tải dữ liệu
  const [error, setError] = useState('');  // Khai báo state để lưu thông báo lỗi (nếu có)
  const [selectedProduct, setSelectedProduct] = useState<any>(null);  // State để lưu thông tin sản phẩm khi chọn chỉnh sửa
  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:1234/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  const filteredProducts = products.filter(product => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(lowerSearchQuery) ||
      product.nameEn.toLowerCase().includes(lowerSearchQuery) ||
      product.price.toString().includes(lowerSearchQuery)
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

  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setImage(product.image);
    setShowPopup(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Tạo form data để gửi ảnh
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('http://localhost:1234/api/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setImage(response.data.imageUrl);  // Cập nhật ảnh mới từ server
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedProduct((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      // Cập nhật sản phẩm với ảnh mới
      const updatedProduct = { ...selectedProduct, image: image };  // Cập nhật thông tin sản phẩm với ảnh mới

      // Gửi yêu cầu PUT để cập nhật sản phẩm
      const response = await axios.put(`http://localhost:1234/api/products/${selectedProduct._id}`, updatedProduct);
      console.log('Product updated:', response.data);

      // Đóng popup sau khi cập nhật thành công
      setShowPopup(false);  

      // Tải lại danh sách sản phẩm
      fetchProducts();  
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteClick = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteConfirmation(true);  // Hiển thị popup xác nhận xóa
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:1234/api/products/${selectedProduct._id}`);
      console.log('Product deleted:', response.data);
      setShowDeleteConfirmation(false);  // Đóng popup xác nhận xóa
      fetchProducts();  // Tải lại danh sách sản phẩm
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  useEffect(() => {
    fetchProducts();
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
            onChange={(e) => setSearchQuery(e.target.value)} // Thêm onChange để cập nhật giá trị
          />
          <button className={styles.searchButton}>
            <img src="searchIcon.png" alt="" />
          </button>
        </div>

        <div className={styles.productTable}>
          {filteredProducts.map((product) => (
            <div key={product._id} className={styles.productCard}>  {/* Sử dụng _id của MongoDB để làm key */}
              <div className={styles.leftTable}>
                <img
                  src={`http://localhost:1234${product.image}`}
                  alt={product.name}
                  className={styles.productImage}
                />
                <div className={styles.productInfo}>
                  <h3><strong>Tên sản phẩm: </strong> {product.name}</h3>
                  <div className={styles.infoProduct}><strong>Mô tả ngắn: </strong>{product.nameEn}</div>
                  <div className={styles.infoProduct}><strong>Mô tả: </strong>{product.description}</div>
                  <div className={styles.infoProduct}><strong>Giá: </strong>{formatCurrency(product.price)}</div>
                  <div className={styles.infoProduct}><strong>Số lượng tồn kho: </strong>{product.stock}</div>
                </div>
              </div>
              <div className={styles.rightTable}>
                <button className={styles.editButton} onClick={() => handleEditClick(product)}>
                  Chỉnh sửa
                </button>
                <button className={styles.removeButton} onClick={() => handleDeleteClick(product)}>
                  Xoá
                </button>
              </div>
            </div>
          ))}
          {/* Popup Form */}
          {showPopup && (
            <div className={styles.popup} onClick={handleOutsideClick}>
              <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closePopup} onClick={handleClosePopup}>X</button>
                <div className={styles.editPopup}>Chỉnh sửa sản phẩm</div>
                <div className={styles.productImageContainer}>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                  />
                  <img
                    src={image ? `http://localhost:1234${image}` : ''}
                    alt="Product"
                    className={styles.productImageSmall}
                    style={{ width: '100px', height: '100px', marginTop: '10px' }}
                  />
                </div>
                <input
                  type="text"
                  name="name"
                  value={selectedProduct.name}
                  onChange={handleFormChange}
                  placeholder="Tên sản phẩm"
                />
                <input
                  type="text"
                  name="nameEn"
                  value={selectedProduct.nameEn}
                  onChange={handleFormChange}
                  placeholder="Tên tiếng anh"
                />
                <input
                  type="text"
                  name="description"
                  value={selectedProduct.description}
                  onChange={handleFormChange}
                  placeholder="Mô tả sản phẩm"
                />
                <input
                  type="number"
                  name="price"
                  value={selectedProduct.price}
                  onChange={handleFormChange}
                  placeholder="Giá sản phẩm"
                />
                <input
                  type="number"
                  name="stock"
                  value={selectedProduct.stock}
                  onChange={handleFormChange}
                  placeholder="Số lượng tồn kho"
                />

                <button className={styles.saveButton} onClick={handleSaveClick}>Lưu</button>
              </div>
            </div>
          )}

          {/* Xác nhận xóa sản phẩm */}
          {showDeleteConfirmation && (
            <div className={styles.popup} onClick={handleOutsideDeleteClick}>
              <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.askDel}>Bạn có chắc muốn xóa sản phẩm này?</div>
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

export default Product;
