import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Blog.module.css';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [blogForm, setBlogForm] = useState({
    image: '',
    title: '',
    shortDescription: '',
    content: '',
    publishDate: ''
  });

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:1234/api/blogs');
      setBlogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blogs => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return (
      blogs.title.toLowerCase().includes(lowerSearchQuery) ||
      blogs.shortDescription.toLowerCase().includes(lowerSearchQuery) ||
      blogs.publishDate.toLowerCase().includes(lowerSearchQuery)
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
    setSelectedBlog(product);
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
    setSelectedBlog((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      const updatedBlog = { ...selectedBlog, image: image };

      // Gửi yêu cầu PUT để cập nhật sản phẩm
      const response = await axios.put(`http://localhost:1234/api/blogs/${selectedBlog._id}`, updatedBlog);
      console.log('Blog updated:', response.data);

      // Đóng popup sau khi cập nhật thành công
      setShowPopup(false);  

      // Tải lại danh sách sản phẩm
      fetchBlogs();  
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const handleDeleteClick = (blog: any) => {
    setSelectedBlog(blog);
    setShowDeleteConfirmation(true);  // Hiển thị popup xác nhận xóa
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:1234/api/blogs/${selectedBlog._id}`);
      console.log('Blog deleted:', response.data);
      setShowDeleteConfirmation(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setSelectedBlog((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };


  useEffect(() => {
    fetchBlogs();
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
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className={styles.productCard}>  {/* Sử dụng _id của MongoDB để làm key */}
              <div className={styles.leftTable}>
                <img
                  src={`http://localhost:1234${blog.image}`}
                  alt={blog.name}
                  className={styles.productImage}
                />
                <div className={styles.productInfo}>
                  <h3><strong>Tiêu đề: </strong> {blog.title}</h3>
                  <div className={styles.infoProduct}><strong>Mô tả: </strong>{blog.shortDescription}</div>
                  <div className={styles.infoProduct}><strong>Nội dung: </strong>{blog.content}</div>
                  <div className={styles.infoProduct}><strong>Ngày đăng: </strong>{blog.publishDate}</div>
                </div>
              </div>
              <div className={styles.rightTable}>
                <button className={styles.editButton} onClick={() => handleEditClick(blog)}>
                  Chỉnh sửa
                </button>
                <button className={styles.removeButton} onClick={() => handleDeleteClick(blog)}>
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
                <div className={styles.editPopup}>Chỉnh sửa bài viết</div>
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
                  name="title"
                  value={selectedBlog.title}
                  onChange={handleFormChange}
                  placeholder="Tiêu đề"
                />
                <input
                  type="text"
                  name="shortDescription"
                  value={selectedBlog.shortDescription}
                  onChange={handleFormChange}
                  placeholder="Mô tả ngắn"
                />
                <textarea
                  name="content"
                  value={selectedBlog.content}
                  className={styles.editTextArea}
                  onChange={handleTextAreaChange}
                  placeholder="Nội dung"
                />
                <input
                  type="text"
                  name="publishDate"
                  value={selectedBlog.publishDate}
                  onChange={handleFormChange}
                  placeholder="Ngày đăng"
                />
                <button className={styles.saveButton} onClick={handleSaveClick}>Lưu</button>
              </div>
            </div>
          )}

          {/* Xác nhận xóa sản phẩm */}
          {showDeleteConfirmation && (
            <div className={styles.popup} onClick={handleOutsideDeleteClick}>
              <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.askDel}>Bạn có chắc muốn xóa bài viết này?</div>
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

export default Blog;