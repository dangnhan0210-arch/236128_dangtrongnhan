require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Food = require('./models/Food');

const app = express();
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// GET /api/foods (Lấy danh sách & Tìm kiếm)
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const foods = await Food.find(query);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// GET /api/foods/:id (Chi tiết món ăn)
app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// POST /api/foods (Thêm món ăn)
app.post('/api/foods', async (req, res) => {
  try {
    const existingFood = await Food.findOne({ foodId: req.body.foodId });
    if (existingFood) return res.status(400).json({ message: 'Mã món ăn đã tồn tại' });
    
    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error });
  }
});

// PUT /api/foods/:id (Cập nhật)
app.put('/api/foods/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFood) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error });
  }
});

// DELETE /api/foods/:id (Xóa)
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.status(200).json({ message: 'Đã xóa món ăn thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// Kết nối MongoDB & Khởi chạy server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));