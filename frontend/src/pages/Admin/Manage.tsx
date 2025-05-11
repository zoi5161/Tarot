import React, { useState } from 'react';
import styles from './Manage.module.css';
import Product from '../../components/Product/Product';
import Blog from '../../components/Blog/Blog';
import axios from 'axios';

const Manage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('Sản phẩm');
  const [showPopup, setShowPopup] = useState(false);
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

  const handleTagClick = (tag: React.SetStateAction<string>) => {
    setSelectedTag(tag);
  };

  const handleAddButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
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
    if (selectedTag === 'Sản phẩm') {
      setProductForm((prev) => ({
        ...prev,
        [name]: value
      }));
    } else {
      setBlogForm((prev) => ({
        ...prev,
        [name]: value
      }));
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
      // Lấy dữ liệu từ form dựa trên tag đã chọn
      const data = selectedTag === 'Sản phẩm' ? productForm : blogForm;

      // Xác định đường dẫn API phù hợp dựa trên selectedTag
      const apiUrl = selectedTag === 'Sản phẩm' ? 'http://localhost:1234/api/products' : 'http://localhost:1234/api/blogs';

      // Gửi yêu cầu POST tới backend
      const response = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Data uploaded successfully:', response.data);
      setShowPopup(false); // Đóng popup sau khi thành công

    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.search}>
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Tìm kiếm..." 
            value={searchQuery}
          />
          <button className={styles.searchButton}>
            <img src="searchIcon.png" alt="" />
          </button>
        </div>
        <button className={styles.addButton} onClick={handleAddButtonClick}>
          Thêm mới
        </button>
      </div>
      <div className={styles.footer}>
        <div className={styles.tagsList}>
          <div className={`${styles.tags} ${selectedTag === 'Sản phẩm' ? styles.selectedTag : ''}`} onClick={() => handleTagClick('Sản phẩm')}>
            Sản phẩm
          </div>
          <div className={`${styles.tags} ${selectedTag === 'Bài viết' ? styles.selectedTag : ''}`} onClick={() => handleTagClick('Bài viết')}>
            Bài viết
          </div>
        </div>

        <div className={styles.table}>
          {selectedTag === 'Sản phẩm' && <Product />}
          {selectedTag === 'Bài viết' && <Blog />}
        </div>
      </div>

      {/* Popup Form */}
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <button className={styles.closePopup} onClick={handleClosePopup}>X</button>
            <h3>{selectedTag === 'Sản phẩm' ? 'Thêm sản phẩm' : 'Thêm bài viết'}</h3>

            {selectedTag === 'Sản phẩm' ? (
              <>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  placeholder="Link ảnh"
                />
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleFormChange}
                  placeholder="Tên sản phẩm"
                />
                <input
                  type="text"
                  name="nameEn"
                  value={productForm.nameEn}
                  onChange={handleFormChange}
                  placeholder="Tên tiếng anh"
                />
                <input
                  type="text"
                  name="description"
                  value={productForm.description}
                  onChange={handleFormChange}
                  placeholder="Mô tả sản phẩm"
                />
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleFormChange}
                  placeholder="Giá sản phẩm"
                />
                <input
                  type="number"
                  name="stock"
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
                  onChange={handleFileChange}
                  placeholder="Link ảnh"
                />
                <input
                  type="text"
                  name="title"
                  value={blogForm.title}
                  onChange={handleFormChange}
                  placeholder="Tiêu đề"
                />
                <input
                  type="text"
                  name="shortDescription"
                  value={blogForm.shortDescription}
                  onChange={handleFormChange}
                  placeholder="Mô tả ngắn"
                />
                <textarea
                  name="content"
                  value={blogForm.content}
                  onChange={handleTextAreaChange}
                  placeholder="Nội dung"
                />
                <input
                  type="date"
                  name="publishDate"
                  value={blogForm.publishDate}
                  onChange={handleFormChange}
                />
              </>
            )}
            <button className={styles.submitButton} onClick={handleSubmit}>Đăng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manage;
