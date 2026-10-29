# 236128_DangTrongNhan - Hệ thống quản lý món ăn

## Công nghệ sử dụng
- Frontend: React, Vite
- Backend: Node.js, Express, MongoDB Atlas
- Triển khai: Docker, Render

## Hướng dẫn chạy cục bộ
1. Cài đặt Node.js và Docker.
2. Clone repository này.
3. Tạo file `.env` ở thư mục `backend` và điền `MONGO_URI`.
4. Backend: `cd backend && npm install && npm start`
5. Frontend: `cd frontend && npm install && npm run dev`

## Hướng dẫn chạy với Docker
1. Chạy Backend: `docker build -t 236128_DangTrongNhan/backend ./backend` -> `docker run -p 5000:5000 --env-file ./backend/.env 236128_DangTrongNhan/backend`
2. Chạy Frontend: `docker build -t 236128_DangTrongNhan/frontend ./frontend` -> `docker run -p 80:80 236128_DangTrongNhan/frontend`

## URL Triển khai
- Frontend: [Link_Render_App]
- Backend API: [Link_Render_API]