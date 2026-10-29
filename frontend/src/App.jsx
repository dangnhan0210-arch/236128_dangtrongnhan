import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/foods';

function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    foodId: '', name: '', category: '', cuisine: '', ingredients: '', price: '', quantity: '', description: '', imageUrl: ''
  });

  const fetchFoods = async (searchQuery = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?search=${searchQuery}`);
      setFoods(res.data);
    } catch (error) {
      setMessage('Lỗi khi tải dữ liệu');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(search);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tách ingredients thành mảng
      const dataToSubmit = {
        ...formData,
        ingredients: formData.ingredients.split(',').map(i => i.trim())
      };
      
      await axios.post(API_URL, dataToSubmit);
      setMessage('Thêm món ăn thành công!');
      fetchFoods();
      setFormData({ foodId: '', name: '', category: '', cuisine: '', ingredients: '', price: '', quantity: '', description: '', imageUrl: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Lỗi khi thêm món ăn');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage('Đã xóa món ăn');
        fetchFoods();
      } catch (error) {
        setMessage('Lỗi khi xóa');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Quản lý Món ăn</h1>
      {message && <p style={{ color: 'red' }}><b>{message}</b></p>}
      
      {/* Tìm kiếm */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input 
          type="text" placeholder="Tìm kiếm món ăn..." 
          value={search} onChange={(e) => setSearch(e.target.value)} 
        />
        <button type="submit">Tìm</button>
      </form>

      {/* Form Thêm món ăn */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '400px', marginBottom: '30px' }}>
        <h3>Thêm món ăn mới</h3>
        <input name="foodId" placeholder="Mã món ăn" value={formData.foodId} onChange={handleInputChange} required />
        <input name="name" placeholder="Tên món ăn" value={formData.name} onChange={handleInputChange} required />
        <input name="category" placeholder="Phân loại" value={formData.category} onChange={handleInputChange} required />
        <input name="cuisine" placeholder="Vùng miền" value={formData.cuisine} onChange={handleInputChange} required />
        <input name="ingredients" placeholder="Nguyên liệu (cách nhau bằng dấu phẩy)" value={formData.ingredients} onChange={handleInputChange} required />
        <input name="price" type="number" placeholder="Giá" value={formData.price} onChange={handleInputChange} required />
        <input name="quantity" type="number" placeholder="Số lượng" value={formData.quantity} onChange={handleInputChange} required />
        <textarea name="description" placeholder="Mô tả" value={formData.description} onChange={handleInputChange} required />
        <input name="imageUrl" placeholder="Link hình ảnh" value={formData.imageUrl} onChange={handleInputChange} />
        <button type="submit">Thêm</button>
      </form>

      {/* Danh sách món ăn */}
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên món</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {foods.map(food => (
              <tr key={food._id}>
                <td>{food.foodId}</td>
                <td>{food.name}</td>
                <td>{food.category}</td>
                <td>{food.price}</td>
                <td>{food.quantity}</td>
                <td>
                  <button onClick={() => handleDelete(food._id)}>Xóa</button>
                  {/* Có thể tạo thêm tính năng Xem chi tiết và Sửa ở đây */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;