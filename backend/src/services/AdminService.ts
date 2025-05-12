import AdminModel from '../models/AdminModel';
import bcrypt from 'bcryptjs';

export const registerAdmin = async (username: string, password: string) => {
  // Kiểm tra xem quản trị viên đã tồn tại chưa
  const existingAdmin = await AdminModel.findOne({ username });
  if (existingAdmin) {
    throw new Error('Username already exists!');
  }

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Tạo mới quản trị viên
  const newAdmin = new AdminModel({
    username,
    password: hashedPassword,
  });

  await newAdmin.save();

  return newAdmin;
};

// Hàm kiểm tra đăng nhập của quản trị viên
export const loginAdmin = async (username: string, password: string) => {
  // Tìm kiếm quản trị viên với username
  const admin = await AdminModel.findOne({ username });
  if (!admin) {
    throw new Error('Tài khoản không tồn tại!');
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new Error('Sai mật khẩu!');
  }

  return admin;  // Trả về thông tin quản trị viên nếu đăng nhập thành công
};